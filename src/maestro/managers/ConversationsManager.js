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

  async createConversationMessage({ conversationId, text, attachments, embeds }) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const message = {
      text,
      attachments: (attachments) ? attachments.map(attachment => attachment.id) : null,
      embeds: (embeds) ? embeds.map(embed => embed.id) : null,
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

    const response = await apiHelper.post({
      path: `/conversations/${conversationId}/messages`,
      data: message,
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
}
