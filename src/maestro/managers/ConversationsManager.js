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
    const response = await apiHelper.post({
      path: '/conversations',
      data: { accessLevel, users, message },
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
      text,
      nonce: `${conversationId}-${userManager.store.user.id}-${Date.now()}`,
    };

    this._addMessageToConversation({
      conversationId,
      message: {
        ...message,
        attachments,
        embeds,
        user: userManager.store.user,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
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

  /*
   * Helpers
   */

  _addMessageToConversation({ conversationId, message }) {
    this._removeMessageFromConversation({ // dedupe & remove optimistics
      conversationId,
      conversationMessageId: message.id,
      conversationMessageNonce: message.nonce,
    });

    const { store } = this;
    const activeConversation = (store.activeConversation) ? { ...store.activeConversation } : null;
    const conversations = (store.conversations) ? [ ...store.conversations ] : null;

    if (activeConversation && activeConversation.id === conversationId) {
      activeConversation.conversationMessages.push(message);
      activeConversation.conversationMessages.sort(this._conversationMessagesSorter);
    }

    if (conversations) {
      const conversation = conversations.find(conversation => conversation.id === conversationId);

      if (conversation) {
        conversation.conversationMessages.push(message);
        conversation.conversationMessages.sort(this._conversationMessagesSorter);
      }
    }

    this.updateStore({ activeConversation, conversations });
  }

  _removeMessageFromConversation({ conversationId, conversationMessageId, conversationMessageNonce }) {
    const { store } = this;
    const activeConversation = (store.activeConversation) ? { ...store.activeConversation } : null;
    const conversations = (store.conversations) ? [ ...store.conversations ] : null;
    const removeMessage = conversationMessages => {
      return conversationMessages.filter(conversationMessage => (
        (!conversationId || conversationMessage.id !== conversationId) &&
        conversationMessage.nonce !== conversationMessageNonce
      )).sort(this._conversationMessagesSorter);
    };

    if (activeConversation && activeConversation.id === conversationId) {
      activeConversation.conversationMessages = removeMessage(activeConversation.conversationMessages);
    }

    if (conversations) {
      const conversation = conversations.find(conversation => conversation.id === conversationId);

      if (conversation) {
        conversation.conversationMessages = removeMessage(conversation.conversationMessages);
      }
    }

    this.updateStore({ activeConversation, conversations });
  }

  _conversationMessagesSorter = (conversationMessageA, conversationMessageB) => {
    if (conversationMessageA.createdAt < conversationMessageB.createdAt) {
      return -1;
    }

    if (conversationMessageA.createdAt > conversationMessageB.createdAt) {
      return 1;
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
