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
    usersConversations: {},
    lastConversationsHash: '',
  }

  get storeName() {
    return 'conversations';
  }

  receiveStoreUpdate({ conversations }) {
    const { lastConversationsHash } = conversations;
    let hash = ''; // not a true hash, shrug, doesn't matter here.

    this._iterateConversationTypes(({ conversations }) => {
      conversations.forEach(conversation => hash += `${conversation.id}`);
    }, false);

    if (hash !== lastConversationsHash) {
      this._syncConversationEvents();
      this.updateStore({ lastConversationsHash: hash });
    }
  }

  async getConversationUsers(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/conversations/${conversationId}/users` });

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

    this.markConversationRead(response.body.id);

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

  async loadUsersConversations(userId) {
    const usersConversations = { ...this.store.usersConversations };
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/users/${userId}/conversations` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    usersConversations[userId] = response.body;

    this.updateStore({ usersConversations });

    return response.body;
  }

  async searchConversations(search) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/conversations',
      queryParams: { search },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async createConversation({ accessLevel, title, userIds, message }) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const attachments = await this._createAttachments(message.attachments);
    const embeds = await this._createEmbedsFromText(message.text);
    const response = await apiHelper.post({
      path: '/conversations',
      data: {
        accessLevel,
        title,
        userIds,
        message: {
          ...message,
          attachmentIds: attachments.map(attachment => attachment.id),
          embedIds: embeds.map(embed => embed.id),
          nonce: `n-${userManager.store.user.id}-${Date.now()}`,
        },
      },
    });

    if (![ 200, 409 ].includes(response.code)) {
      throw new Error(response.body);
    }

    this._addActiveConversation(response.body);
    this._addRecentConversation(response.body);

    if (accessLevel === 'private') {
      this._addPrivateConversation(response.body);
    } else {
      this._addExploreConversation(response.body);
    }

    this.markConversationRead(response.body.id);

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
        attachmentIds: attachments.map(attachment => attachment.id),
        embedIds: embeds.map(embed => embed.id),
      },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addMessageToConversation({
      conversationId,
      message: response.body,
    });

    this.markConversationRead(conversationId);

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

  async deleteConversation(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/conversations/${conversationId}`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }

    this._removeFromAllConversationTypes(conversationId);
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

  async deleteConversationUser({ conversationId, conversationUserId }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/conversations/${conversationId}/users/${conversationUserId}`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }
  }

  async leaveConversation(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/users/me/conversations/${conversationId}`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }

    this._removeRecentConversation(conversationId);
  }

  async updateConversation({ conversationId, fields }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.patch({
      path: `/conversations/${conversationId}`,
      data: fields,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._updateConversation({ conversationId, fields });
  }

  async createTypingEvent({ conversationId }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.post({
      path: `/conversations/${conversationId}/typing`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }
  }

  async markConversationRead(conversationId) {
    const { apiHelper } = this.maestro.helpers;

    apiHelper.put({ path: `/users/me/conversations/${conversationId}/data` });

    this._iterateConversationTypes(({ conversations, type }) => {
      if (type === 'active') {
        return;
      }

      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        conversation.authUserConversationData = {
          lastReadAt: new Date(),
        };
      });
    });
  }

  removeActiveConversation(conversationId) {
    this._removeActiveConversation(conversationId);
  }

  removeUsersConversations(userId) {
    this._removeUsersConversations(userId);
  }

  /*
   * Helpers
   */

  _addActiveConversation(conversation) {
    this._addConversation({ conversation, type: 'active' });
  }

  _addExploreConversation(conversation) {
    this._addConversation({ conversation, type: 'explore' });
  }

  _addFeedConversation(conversation) {
    this._addConversation({ conversation, type: 'feed' });
  }

  _addPrivateConversation(conversation) {
    this._addConversation({ conversation, type: 'private' });
  }

  _addRecentConversation(conversation) {
    this._addConversation({ conversation, type: 'recent' });
  }

  _addConversation({ conversation, type }) {
    let typeConversations = this._getConversationsByType(type);

    typeConversations = typeConversations.filter(typeConversation => (
      typeConversation.id !== conversation.id
    ));

    if (type !== 'explore' && typeConversations.length >= 5) {
      typeConversations.pop();
    }

    typeConversations.unshift(conversation);

    this._updateConversationsByType({
      conversations: typeConversations,
      type,
    });
  }

  _removeFromAllConversationTypes(conversationId) {
    this._removeActiveConversation(conversationId);
    this._removeExploreConversation(conversationId);
    this._removeFeedConversation(conversationId);
    this._removePrivateConversation(conversationId);
    this._removeRecentConversation(conversationId);
    this._removeUsersConversation(conversationId);
  }

  _removeActiveConversation(conversationId) {
    this._removeConversation({ conversationId, type: 'active' });
  }

  _removeExploreConversation(conversationId) {
    this._removeConversation({ conversationId, type: 'explore' });
  }

  _removeFeedConversation(conversationId) {
    this._removeConversation({ conversationId, type: 'feed' });
  }

  _removePrivateConversation(conversationId) {
    this._removeConversation({ conversationId, type: 'private' });
  }

  _removeRecentConversation(conversationId) {
    this._removeConversation({ conversationId, type: 'recent' });
  }

  _removeUsersConversation(conversationId) {
    this._removeConversation({ conversationId, type: 'users' });
  }

  _removeConversation({ conversationId, type }) {
    let typeConversations = this._getConversationsByType(type);

    if (type !== 'users') {
      typeConversations = typeConversations.filter(typeConversation => (
        typeConversation.id !== conversationId
      ));
    } else {
      Object.keys(typeConversations).forEach(userId => {
        typeConversations[userId] = typeConversations[userId].filter(userConversation => (
          userConversation.id !== conversationId
        ));
      });
    }

    this._updateConversationsByType({
      conversations: typeConversations,
      type,
    });
  }

  _updateConversation({ conversationId, fields }) {
    this._iterateConversationTypes(({ conversations }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        Object.assign(conversation, fields);
      });
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

        if (type !== 'active' && (message.user.id === userManager.store.user.id || [ 'recent', 'private' ].includes(type))) {
          newRecentConversation = conversation;
        }
      });
    });

    if (newRecentConversation) {
      this._addRecentConversation(newRecentConversation);
    }

    this._removeTypingUserFromConversation({ conversationId, userId: message.user.id });
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
    const { userManager } = this.maestro.managers;
    const loggedInUserId = userManager.store.user.id;

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

        if (!reaction.userId || reaction.userId === loggedInUserId) {
          if (authUserConversationMessageReactionIndex !== -1) {
            authUserConversationMessageReactions[authUserConversationMessageReactionIndex] = reaction;
          } else {
            authUserConversationMessageReactions.push(reaction);
          }
        }

        const conversationMessageReaction = conversationMessageReactions.find(conversationMessageReaction => (
          conversationMessageReaction.reaction === reaction.reaction
        ));

        if (conversationMessageReaction && !conversationMessageReaction?.createUserIds?.includes(reaction.userId)) {
          conversationMessageReaction.createUserIds = conversationMessageReaction.createUserIds || [];
          conversationMessageReaction.createUserIds.push(reaction.userId || loggedInUserId);

          if (conversationMessageReaction.deleteUserIds) {
            conversationMessageReaction.deleteUserIds = conversationMessageReaction.deleteUserIds.filter(deleteUserId => (
              deleteUserId !== reaction.userId
            ));
          }

          conversationMessageReaction.count++;
        } else if (!conversationMessageReaction) {
          conversationMessageReactions.push({
            reaction: reaction.reaction,
            createUserIds: (reaction.userId) ? [ reaction.userId ] : [ loggedInUserId ],
            count: 1,
          });
        }
      });
    });
  }

  _removeReactionFromConversationMessage({ conversationId, conversationMessageId, conversationMessageReactionId, userId, reaction }) {
    const { userManager } = this.maestro.managers;
    const loggedInUserId = userManager.store.user.id;

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
        const relevantAuthUserConversationMessageReaction = authUserConversationMessageReactions.find(conversationMessageReaction => (
          (conversationMessageReactionId && conversationMessageReaction.id === conversationMessageReactionId) ||
          (userId === loggedInUserId && conversationMessageReaction.reaction === reaction)
        ));

        conversationMessage.authUserConversationMessageReactions = authUserConversationMessageReactions.filter(conversationMessageReaction => (
          conversationMessageReaction.id !== relevantAuthUserConversationMessageReaction?.id
        ));

        const relevantConversationMessageReaction = conversationMessageReactions.find(conversationMessageReaction => (
          conversationMessageReaction.reaction === relevantAuthUserConversationMessageReaction?.reaction ||
          conversationMessageReaction.reaction === reaction
        ));

        if (!relevantConversationMessageReaction || (userId && relevantConversationMessageReaction?.deleteUserIds?.includes(userId))) {
          return;
        }

        if (relevantConversationMessageReaction.count > 1) {
          relevantConversationMessageReaction.deleteUserIds = relevantConversationMessageReaction.deleteUserIds || [];
          relevantConversationMessageReaction.deleteUserIds.push(userId || loggedInUserId);

          if (relevantConversationMessageReaction.createUserIds) {
            relevantConversationMessageReaction.createUserIds = relevantConversationMessageReaction.createUserIds.filter(createUserId => (
              createUserId !== userId
            ));
          }

          relevantConversationMessageReaction.count--;
        } else {
          conversationMessage.conversationMessageReactions = conversationMessageReactions.filter(conversationMessageReaction => (
            conversationMessageReaction.reaction !== relevantConversationMessageReaction.reaction
          ));
        }
      });
    });
  }

  _addTypingUserToConversation({ conversationId, user }) {
    const loggedInUserId = this.maestro.managers.userManager.store.user.id;

    if (user.id === loggedInUserId) {
      return;
    }

    this._iterateConversationTypes(({ conversations, type }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        conversation.conversationTypingUsers = conversation.conversationTypingUsers || [];
        conversation.conversationTypingUsers = conversation.conversationTypingUsers.filter(conversationTypingUser => (
          conversationTypingUser.id !== user.id
        )).sort(this._conversationTypingUsersSorter);

        conversation.conversationTypingUsers.push(user);
      });
    });
  }

  _removeTypingUserFromConversation({ conversationId, userId }) {
    this._iterateConversationTypes(({ conversations }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        conversation.conversationTypingUsers = conversation.conversationTypingUsers || [];
        conversation.conversationTypingUsers = conversation.conversationTypingUsers.filter(conversationTypingUser => (
          conversationTypingUser.id !== userId
        )).sort(this._conversationTypingUsersSorter);
      });
    });
  }

  _getConversationsByType = type => {
    const { store } = this;

    if (type === 'active') {
      return (store.activeConversations) ? [ ...store.activeConversations ] : [];
    }

    if (type === 'explore') {
      return (store.exploreConversations) ? [ ...store.exploreConversations ] : [];
    }

    if (type === 'feed') {
      return (store.feedConversations) ? [ ...store.feedConversations ] : [];
    }

    if (type === 'private') {
      return (store.privateConversations) ? [ ...store.privateConversations ] : [];
    }

    if (type === 'recent') {
      return (store.recentConversations) ? [ ...store.recentConversations ] : [];
    }

    if (type === 'users') {
      return (store.usersConversations) ? { ...this.store.usersConversations } : {};
    }
  }

  _updateConversationsByType = ({ conversations, type }) => {
    this.updateStore({
      activeConversations: (type === 'active') ? conversations : this.store.activeConversations,
      exploreConversations: (type === 'explore') ? conversations : this.store.exploreConversations,
      feedConversations: (type === 'feed') ? conversations : this.store.feedConversations,
      privateConversations: (type === 'private') ? conversations : this.store.privateConversations,
      recentConversations: (type === 'recent') ? conversations : this.store.recentConversations,
      usersConversations: (type === 'users') ? conversations : this.store.usersConversations,
    });
  }

  _iterateConversationTypes = (modifierFunction, updateStore = true) => {
    const { store } = this;
    const activeConversations = (store.activeConversations) ? [ ...store.activeConversations ] : null;
    const exploreConversations = (store.exploreConversations) ? [ ...store.exploreConversations ] : null;
    const feedConversations = (store.feedConversations) ? [ ...store.feedConversations ] : null;
    const privateConversations = (store.privateConversations) ? [ ...store.privateConversations ] : null;
    const recentConversations = (store.recentConversations) ? [ ...store.recentConversations ] : null;
    const usersConversations = (store.usersConversations) ? { ...store.usersConversations } : null;

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

    if (typeof usersConversations === 'object') {
      Object.values(usersConversations).forEach(userConversations => {
        modifierFunction({
          conversations: userConversations,
          type: 'users',
        });
      });
    }

    if (updateStore) {
      this.updateStore({
        activeConversations,
        exploreConversations,
        feedConversations,
        privateConversations,
        recentConversations,
        usersConversations,
      });
    }
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

  _conversationTypingUsersSorter = (conversationTypingUserA, conversationTypingUserB) => {
    return conversationTypingUserA.typingAt > conversationTypingUserB.typingAt ? -1 : 1;
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

  _syncConversationEvents = () => {
    const { eventsManager } = this.maestro.managers;

    // maybe we should diff and unsubscribe from no longer loaded convos to reduce network overhead?

    this._iterateConversationTypes(({ conversations }) => {
      conversations.forEach(conversation => {
        eventsManager.subscribe(`conversation-${conversation.eventsToken}`);
      });
    }, false);
  }
}
