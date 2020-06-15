import { Manager } from 'react-native-maestro';

export default class ConversationsManager extends Manager {
  static get instanceKey() {
    return 'conversationsManager';
  }

  static initialStore = {
    activeConversations: null,
    exploreConversations: null,
    feedConversations: null,
    privateConversations: null,
    recentConversations: null,
  }

  get storeName() {
    return 'conversations';
  }

  async getConversationsByUserId(userId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/users/${userId}/conversations` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async getPrivateConversationByUserIds(userIds) { // TODO: review implementation
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/conversations',
      queryParams: { privateUserIds: userIds },
    });

    if (![ 200, 204 ].includes(response.code)) {
      throw new Error(response.body);
    }

    const conversation = response.body || null;

    if (conversation) {
      conversation.conversationMessages.sort(this._conversationMessagesSorter);
    }

    return conversation;
  }

  async loadActiveConversation(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/conversations/${conversationId}` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    response.body.conversationMessages.sort(this._conversationMessagesSorter);

    this._addActiveConversation(response.body);

    return response.body;
  }

  async loadRecentConversations() {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/conversations',
      queryParams: { accessLevels: [ 'public', 'protected', 'private' ] },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this.updateStore({ recentConversations: response.body });

    return response.body;
  }

  async loadPrivateConversations() {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/conversations',
      queryParams: { accessLevels: [ 'private' ] },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this.updateStore({ privateConversations: response.body });

    return response.body;
  }

  async loadFeedConversations() {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/conversations',
      queryParams: { feed: true },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this.updateStore({ feedConversations: response.body });

    return response.body;
  }

  async loadExploreConversations() {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: '/conversations' });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this.updateStore({ exploreConversations: response.body });

    return response.body;
  }

  async createConversation({ accessLevel, title, users, message }) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const attachments = await this._createAttachments(message.attachments);
    const embeds = await this._createEmbedsFromText(message.text);
    const response = await apiHelper.post({
      path: '/conversations',
      data: {
        accessLevel,
        title,
        users,
        message: {
          ...message,
          attachments: attachments.map(attachment => attachment.id),
          embeds: embeds.map(embed => embed.id),
          nonce: `n-${userManager.store.user.id}-${Date.now()}`,
        },
      },
    });

    if (![ 200, 409 ].includes(response.code)) {
      throw new Error(response.body);
    }

    this._addActiveConversation(response.body);
    this._addConversationToRecentConversations(response.body);

    return response.body;
  }

  async createConversationMessage({ conversationId, text, attachments, embeds }) {
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
    embeds = await this._createEmbedsFromText(text);

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

  removeActiveConversation(conversationId) {
    const { activeConversations } = this.store;

    if (activeConversations) {
      this.updateStore({
        activeConversations: activeConversations.filter(conversation => {
          return conversation.id !== conversationId;
        }),
      });
    }
  }

  /*
   * Helpers
   */

  _addActiveConversation(conversation) {
    this.updateStore({
      activeConversations: (this.store.activeConversations)
        ? [ ...this.store.activeConversations, conversation ]
        : [ conversation ],
    });
  }

  _addMessageToConversation({ conversationId, message }) {
    const { userManager } = this.maestro.managers;
    let newRecentConversation = null;

    this._iterateConversationTypes(({ conversations, type }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        if (type === 'active') {
          conversation.conversationMessages = conversation.conversationMessages.filter(conversationMessage => (
            conversationMessage.nonce !== message.nonce
          ));

          conversation.conversationMessages.push(message);
          conversation.conversationMessages.sort(this._conversationMessagesSorter);
        } else {
          conversation.previewConversationMessage = message;
        }

        // this may need revisiting when we add in MQTT?
        if (type !== 'active' && (message.user.id === userManager.store.user.id || [ 'recent', 'private' ].includes(type))) {
          newRecentConversation = conversation;
        }
      });
    });

    if (newRecentConversation) {
      this._addConversationToRecentConversations(newRecentConversation);
    }
  }

  _removeMessageFromConversation({ conversationId, conversationMessageId }) {
    this._iterateConversationTypes(({ conversations, type }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        if (type === 'active') {
          conversation.conversationMessages = conversation.conversationMessages.filter(conversationMessage => (
            (conversationMessage.id !== conversationMessageId)
          )).sort(this._conversationMessagesSorter);
        } else {
          conversation.previewConversationMessage = null;
        }
      });
    });
  }

  _addReactionToConversationMessage({ conversationId, conversationMessageId, reaction }) {
    this._iterateConversationTypes(({ conversations, type }) => {
      if (type !== 'active') {
        return;
      }

      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        const conversationMessage = conversation.conversationMessages.find(conversationMessage => (
          conversationMessage.id === conversationMessageId
        ));

        if (!conversationMessage) {
          return;
        }

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
      });
    });
  }

  _removeReactionFromConversationMessage({ conversationId, conversationMessageId, conversationMessageReactionId }) {
    this._iterateConversationTypes(({ conversations, type }) => {
      if (type !== 'active') {
        return;
      }

      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        const conversationMessage = conversation.conversationMessages.find(conversationMessage => (
          conversationMessage.id === conversationMessageId
        ));

        if (!conversationMessage) {
          return;
        }

        const authUserConversationMessageReactions = conversationMessage.authUserConversationMessageReactions || [];
        const conversationMessageReactions = conversationMessage.conversationMessageReactions || [];
        const removedConversationMessageReaction = authUserConversationMessageReactions.find(conversationMessageReaction => (
          (conversationMessageReactionId && conversationMessageReaction.id === conversationMessageReactionId)
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
      });
    });
  }

  _addConversationToRecentConversations(conversation) {
    const { store } = this;
    let recentConversations = (store.recentConversations) ? [ ...store.recentConversations ] : [];

    recentConversations = recentConversations.filter(recentConversation => (
      recentConversation.id !== conversation.id
    ));

    if (recentConversations.length === 5) {
      recentConversations.pop();
    }

    recentConversations.unshift(conversation);

    this.updateStore({ recentConversations });
  }

  _iterateConversationTypes = modifierFunction => {
    const { store } = this;
    const activeConversations = (store.activeConversations) ? [ ...store.activeConversations ] : null;
    const exploreConversations = (store.exploreConversations) ? [ ...store.exploreConversations ] : null;
    const feedConversations = (store.feedConversations) ? [ ...store.feedConversations ] : null;
    const privateConversations = (store.privateConversations) ? [ ...store.privateConversations ] : null;
    const recentConversations = (store.recentConversations) ? [ ...store.recentConversations ] : null;

    if (Array.isArray(activeConversations)) {
      modifierFunction({
        conversations: activeConversations,
        type: 'active',
      });
    }

    if (Array.isArray(exploreConversations)) {
      modifierFunction({
        conversations: exploreConversations,
        type: 'explore',
      });
    }

    if (Array.isArray(feedConversations)) {
      modifierFunction({
        conversations: feedConversations,
        type: 'feed',
      });
    }

    if (Array.isArray(privateConversations)) {
      modifierFunction({
        conversations: privateConversations,
        type: 'private',
      });
    }

    if (Array.isArray(recentConversations)) {
      modifierFunction({
        conversations: recentConversations,
        type: 'recent',
      });
    }

    this.updateStore({
      activeConversations,
      exploreConversations,
      feedConversations,
      privateConversations,
      recentConversations,
    });
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

    if (typeof text !== 'string') {
      return [];
    }

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

    if (!Array.isArray(attachments)) {
      return [];
    }

    attachments.forEach(attachment => {
      attachmentPromises.push(attachmentsHelper.uploadAttachment(attachment.url));
    });

    return Promise.all(attachmentPromises);
  }
}
