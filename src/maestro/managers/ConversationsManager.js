import { Manager } from 'react-native-maestro';

export default class ConversationsManager extends Manager {
  static get instanceKey() {
    return 'conversationsManager';
  }

  static initialStore = {
    activeConversation: null,
    conversations: null,
  }

  get storeName() {
    return 'conversations';
  }

  async loadActiveConversation(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/conversations/${conversationId}` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    response.body.conversationMessages.sort(this._conversationMessagesSorter);

    this.updateStore({ activeConversation: response.body });

    return response.body;
  }

  async loadActivePrivateConversationByUserIds(userIds) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/conversations',
      queryParams: { privateUserIds: userIds },
    });

    if (![ 200, 204 ].includes(response.code)) {
      throw new Error(response.body);
    }

    const activeConversation = response.body || null;

    if (activeConversation) {
      activeConversation.conversationMessages.sort(this._conversationMessagesSorter);
    }

    this.updateStore({ activeConversation: activeConversation });

    return activeConversation;
  }

  async loadConversations() {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: '/conversations' });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this.updateStore({ conversations: response.body });

    return response.body;
  }

  async createConversation({ accessLevel, users, message }) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const response = await apiHelper.post({
      path: '/conversations',
      data: {
        accessLevel,
        users,
        message: {
          ...message,
          nonce: `n-${userManager.store.user.id}-${Date.now()}`,
        },
      },
    });

    if (![ 200, 409 ].includes(response.code)) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async createConversationMessage({ conversationId, text, attachments = [], embeds = [] }) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const message = {
      text: text.trim(),
      nonce: `${conversationId}-${userManager.store.user.id}-${Date.now()}`,
    };

    this._addMessageToConversation({
      conversationId,
      message: {
        ...message,
        attachments,
        embeds,
        user: userManager.store.user,
        updatedAt: new Date(),
        createdAt: new Date(),
        optimistic: true,
      },
    });

    attachments = await this._createAttachments(attachments);
    embeds = await this._createEmbedsFromText(text); // OPTIMIZATION: maybe better to post message, then patch with embeds?

    const response = await apiHelper.post({
      path: `/conversations/${conversationId}/messages`,
      data: {
        ...message,
        attachments: attachments.map(attachment => attachment.id),
        embeds: embeds.map(embed => embed.id),
      },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addMessageToConversation({
      conversationId,
      message: response.body,
    });

    return response.body;
  }

  async createConversationMessageReaction({ conversationId, conversationMessageId, emoji }) {
    const { apiHelper } = this.maestro.helpers;
    const reaction = {
      reaction: emoji,
      optimistic: true,
    };

    this._addReactionToConversationMessage({
      conversationId,
      conversationMessageId,
      reaction,
    });

    const response = await apiHelper.put({
      path: `/conversations/${conversationId}/messages/${conversationMessageId}/reactions`,
      data: reaction,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addReactionToConversationMessage({
      conversationId,
      conversationMessageId,
      reaction: response.body,
    });

    return response.body;
  }

  async deleteConversationMessage({ conversationId, conversationMessageId }) {
    this._removeMessageFromConversation({ conversationId, conversationMessageId });

    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/conversations/${conversationId}/messages/${conversationMessageId}`,
    });

    if (response.code !== 204) {
      // TODO: should probably re-add the message to UI if delete fails?
      throw new Error(response.body);
    }
  }

  async deleteConversationMessageReaction({ conversationId, conversationMessageId, conversationMessageReactionId }) {
    this._removeReactionFromConversationMessage({
      conversationId,
      conversationMessageId,
      conversationMessageReactionId,
    });

    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/conversations/${conversationId}/messages/${conversationMessageId}/reactions/${conversationMessageReactionId}`,
    });

    if (response.code !== 204) {
      // TODO: should probably re-add the reaction to UI if delete fails
      throw new Error(response.body);
    }
  }

  resetActiveConversation() {
    this.updateStore({ activeConversation: null });
  }

  /*
   * Helpers
   */

  _addMessageToConversation({ conversationId, message }) {
    const { store } = this;
    const activeConversation = (store.activeConversation) ? { ...store.activeConversation } : null;
    const conversations = (store.conversations) ? [ ...store.conversations ] : null;

    const removeOptimistics = conversationMessages => {
      return conversationMessages.filter(conversationMessage => (
        conversationMessage.nonce !== message.nonce
      ));
    };

    if (activeConversation && activeConversation.id === conversationId) {
      activeConversation.conversationMessages = removeOptimistics(activeConversation.conversationMessages);
      activeConversation.conversationMessages.push(message);
      activeConversation.conversationMessages.sort(this._conversationMessagesSorter);
    }

    if (conversations) {
      const conversation = conversations.find(conversation => conversation.id === conversationId);

      if (conversation) {
        conversation.conversationMessages = removeOptimistics(conversation.conversationMessages);
        conversation.conversationMessages.push(message);
        conversation.conversationMessages.sort(this._conversationMessagesSorter);
        conversation.previewConversationMessage = message;
      }
    }

    this.updateStore({ activeConversation, conversations });
  }

  _removeMessageFromConversation({ conversationId, conversationMessageId, nonce }) {
    const { store } = this;
    const activeConversation = (store.activeConversation) ? { ...store.activeConversation } : null;
    const conversations = (store.conversations) ? [ ...store.conversations ] : null;

    const removeMessage = conversationMessages => {
      return conversationMessages.filter(conversationMessage => (
        (!conversationId || conversationMessage.id !== conversationMessageId) &&
        (!nonce || conversationMessage.nonce !== nonce)
      )).sort(this._conversationMessagesSorter);
    };

    if (activeConversation && activeConversation.id === conversationId) {
      activeConversation.conversationMessages = removeMessage(activeConversation.conversationMessages);
    }

    if (conversations) {
      const conversation = conversations.find(conversation => conversation.id === conversationId) || {};

      if (conversation) {
        conversation.conversationMessages = removeMessage(conversation.conversationMessages);

        if (conversation.previewConversationMessage?.id === conversationMessageId) {
          conversation.previewConversationMessage = null;
        }
      }
    }

    this.updateStore({ activeConversation, conversations });
  }

  _addReactionToConversationMessage({ conversationId, conversationMessageId, reaction }) {
    const { store } = this;
    const activeConversation = (store.activeConversation) ? { ...store.activeConversation } : null;
    const conversations = (store.conversations) ? [ ...store.conversations ] : null;

    const addReactionToConversationMessage = conversationMessage => {
      conversationMessage.authUserConversationMessageReactions = conversationMessage.authUserConversationMessageReactions || [];
      conversationMessage.conversationMessageReactions = conversationMessage.conversationMessageReactions || [];

      const { authUserConversationMessageReactions, conversationMessageReactions } = conversationMessage;

      const authUserConversationMessageReactionIndex = authUserConversationMessageReactions.findIndex(conversationMessageReaction => (
        conversationMessageReaction.reaction === reaction.reaction
      ));

      if (authUserConversationMessageReactionIndex !== -1) {
        authUserConversationMessageReactions[authUserConversationMessageReactionIndex] = reaction;
      } else {
        authUserConversationMessageReactions.push(reaction);
      }

      const conversationMessageReaction = conversationMessageReactions.find(conversationMessageReaction => (
        conversationMessageReaction.reaction === reaction.reaction
      ));

      if (authUserConversationMessageReactionIndex === -1 && conversationMessageReaction) {
        conversationMessageReaction.count++;
      } else if (!conversationMessageReaction) {
        conversationMessageReactions.push({
          ...reaction,
          count: 1,
        });
      }
    };

    const findMessageInConversationAndAddReaction = conversation => {
      const { previewConversationMessage } = conversation;
      const conversationMessage = conversation.conversationMessages.find(conversationMessage => (
        conversationMessage.id === conversationMessageId
      ));

      if (conversationMessage) {
        addReactionToConversationMessage(conversationMessage);
      }

      if (previewConversationMessage && previewConversationMessage.id === conversationMessageId) {
        addReactionToConversationMessage(previewConversationMessage);
      }
    };

    if (activeConversation && activeConversation.id === conversationId) {
      findMessageInConversationAndAddReaction(activeConversation);
    }

    if (conversations) {
      const conversation = conversations.find(conversation => conversation.id === conversationId);

      if (conversation) {
        findMessageInConversationAndAddReaction(conversation);
      }
    }

    this.updateStore({ activeConversation, conversations });
  }

  _removeReactionFromConversationMessage({ conversationId, conversationMessageId, conversationMessageReactionId, reaction }) {
    const { store } = this;
    const activeConversation = (store.activeConversation) ? { ...store.activeConversation } : null;
    const conversations = (store.conversations) ? [ ...store.conversations ] : null;

    const removeReactionFromConversationMessage = conversationMessage => {
      const authUserConversationMessageReactions = conversationMessage.authUserConversationMessageReactions || [];
      const conversationMessageReactions = conversationMessage.conversationMessageReactions || [];
      const removedConversationMessageReaction = authUserConversationMessageReactions.find(conversationMessageReaction => (
        (conversationMessageReactionId && conversationMessageReaction.id === conversationMessageReactionId) ||
        (reaction && conversationMessageReaction.reaction === reaction)
      ));

      if (!removedConversationMessageReaction) {
        return;
      }

      conversationMessage.authUserConversationMessageReactions = authUserConversationMessageReactions.filter(conversationMessageReaction => (
        conversationMessageReaction.id !== removedConversationMessageReaction.id
      ));

      const conversationMessageReaction = conversationMessageReactions.find(conversationMessageReaction => (
        conversationMessageReaction.reaction === removedConversationMessageReaction.reaction
      ));

      if (conversationMessageReaction.count > 1) {
        conversationMessageReaction.count--;
      } else {
        conversationMessage.conversationMessageReactions = conversationMessageReactions.filter(conversationMessageReaction => (
          conversationMessageReaction.reaction !== removedConversationMessageReaction.reaction
        ));
      }
    };

    const findMessageInConversationAndRemoveReaction = conversation => {
      const { previewConversationMessage } = conversation;
      const conversationMessage = conversation.conversationMessages.find(conversationMessage => (
        conversationMessage.id === conversationMessageId
      ));

      if (conversationMessage) {
        removeReactionFromConversationMessage(conversationMessage);
      }

      if (previewConversationMessage && previewConversationMessage.id === conversationMessageId) {
        removeReactionFromConversationMessage(previewConversationMessage);
      }
    };

    if (activeConversation && activeConversation.id === conversationId) {
      findMessageInConversationAndRemoveReaction(activeConversation);
    }

    if (conversations) {
      const conversation = conversations.find(conversation => conversation.id === conversationId);

      if (conversation) {
        findMessageInConversationAndRemoveReaction(conversation);
      }
    }

    this.updateStore({ activeConversation, conversations });
  }

  _conversationMessagesSorter = (conversationMessageA, conversationMessageB) => {
    if (conversationMessageA.createdAt < conversationMessageB.createdAt) {
      return 1;
    }

    if (conversationMessageA.createdAt > conversationMessageB.createdAt) {
      return -1;
    }

    return 0;
  }

  _createEmbedsFromText = async text => {
    const { apiHelper } = this.maestro.helpers;
    const urls = text.match(/(https?:\/\/|www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*[-a-zA-Z0-9@:%_+~#?&/=])*/ig);
    const embedPromises = [];

    if (!urls) {
      return [];
    }

    urls.forEach(url => {
      embedPromises.push(apiHelper.put({
        path: '/embeds',
        data: { url },
      }));
    });

    const embedResponses = await Promise.all(embedPromises);

    return embedResponses.map(embedResponse => {
      if (embedResponse.code !== 200) {
        throw new Error(embedResponse.body);
      }

      return embedResponse.body;
    });
  }

  _createAttachments = async attachments => {
    const { attachmentsHelper } = this.maestro.helpers;
    const attachmentPromises = [];

    attachments.forEach(attachment => {
      attachmentPromises.push(attachmentsHelper.uploadAttachment(attachment.url));
    });

    return Promise.all(attachmentPromises);
  }
}
