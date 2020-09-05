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
      this.updateStore({ lastConversationsHash: hash });
      this._syncConversationEvents();
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

  async getPrivateConversation({ userIds, phones }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/conversations',
      queryParams: { privateUserIds: userIds, privatePhones: phones },
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

  getFocusedActiveConversation() {
    return this.store.activeConversations[0];
  }

  async loadActiveConversation(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/conversations/${conversationId}` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    response.body.conversationMessages.sort(this._conversationMessagesSorter);

    this._addUpdateActiveConversation(response.body);

    this.markConversationRead(response.body.id);

    return response.body;
  }

  async loadActiveConversationMessages({ conversationId, queryParams }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: `/conversations/${conversationId}/messages`,
      queryParams,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    const activeConversations = this._getConversationsByType('active');
    const activeConversation = activeConversations.find(conversation => conversation.id === conversationId);

    activeConversation.conversationMessages = this._buildUpdatedConversationMessagesArray({
      existingMessages: activeConversation.conversationMessages,
      newMessages: response.body,
      queryParams,
    });

    this.updateStore({ activeConversations });

    return response.body;
  }

  async loadExploreConversations(queryParams) {
    return this._loadConversations({
      conversationsKey: 'exploreConversations',
      queryParams,
    });
  }

  async loadFeedConversations(queryParams) {
    return this._loadConversations({
      conversationsKey: 'feedConversations',
      queryParams: {
        feed: true,
        ...queryParams,
      },
    });
  }

  async loadPrivateConversations(queryParams) {
    return this._loadConversations({
      conversationsKey: 'privateConversations',
      queryParams: {
        accessLevels: [ 'private' ],
        ...queryParams,
      },
    });
  }

  async loadRecentConversations(queryParams) {
    return await this._loadConversations({
      conversationsKey: 'recentConversations',
      queryParams: {
        accessLevels: [ 'public', 'protected', 'private' ],
        ...queryParams,
      },
    });
  }

  async loadUsersConversations({ userId, queryParams }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: `/users/${userId}/conversations`,
      queryParams,
    });

    const usersConversations = { ...this.store.usersConversations };

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    usersConversations[userId] = this._buildUpdatedConversationsArray({
      existingConversations: usersConversations[userId],
      newConversations: response.body,
      queryParams,
    });

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

  async createConversation({ accessLevel, title, userIds, phoneUsers, message }) {
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
        phoneUsers,
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

    this._addUpdateActiveConversation(response.body);
    this._addUpdateRecentConversation(response.body);

    if (accessLevel === 'private') {
      this._addUpdatePrivateConversation(response.body);
    } else {
      this._addUpdateExploreConversation(response.body);
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
        conversationUser: this._getAuthConversationUserFromActiveConversation(conversationId) || {
          userId: userManager.store.user.id,
          user: userManager.store.user,
        },
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

    this._addUpdateConversationAuthConversationUser({
      conversationId,
      conversationUser: response.body.conversationUser,
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

  async createConversationUser({ conversationId, userId, phoneUser }) {
    const { apiHelper } = this.maestro.helpers;

    const response = await apiHelper.put({
      path: `/conversations/${conversationId}/users`,
      data: {
        userId,
        phoneUser,
      },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    const conversation = this._getLoadedConversationById(conversationId);

    this._updateConversation({
      conversationId,
      fields: {
        usersCount: conversation.usersCount + 1,
      },
    });

    return response.body;
  }

  async createConversationRepost(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.put({
      path: `/conversations/${conversationId}/reposts`,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addAuthUserConversationRepostToConversation({
      conversationId,
      repost: response.body,
    });

    return response.body;
  }

  async joinConversation(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const response = await apiHelper.put({
      path: `/conversations/${conversationId}/users`,
      data: { userId: userManager.store.user.id },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addUpdateConversationAuthConversationUser({
      conversationId,
      conversationUser: response.body,
    });

    await this.markConversationRead(conversationId);

    await this._addUpdatePreviewConversation(conversationId);
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

  async deleteConversationRepost(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/conversations/${conversationId}/reposts`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }

    this._removeAuthUserConversationRepostFromConversation(conversationId);
  }

  async leaveConversation(conversationId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/users/me/conversations/${conversationId}`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }

    this._removeConversationAuthConversationUser(conversationId);
    this._removePrivateConversation(conversationId);
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
        if (conversation.id === conversationId) {
          conversation.authUserConversationData = {
            lastReadAt: new Date(),
          };
        }
      });
    });
  }

  removeUsersConversations(userId) {
    this._removeUsersConversations(userId);
  }

  /*
   * Helpers
   */

  async _loadConversations({ conversationsKey, queryParams }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: '/conversations', queryParams });
    const conversations = this.store[conversationsKey];

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this.updateStore({
      [conversationsKey]: this._buildUpdatedConversationsArray({
        existingConversations: conversations,
        newConversations: response.body,
        queryParams,
      }),
    });

    return response.body;
  }

  _addUpdateActiveConversation(conversation) {
    this._addConversation({ conversation, type: 'active' });
  }

  _addUpdateExploreConversation(conversation) {
    this._addConversation({ conversation, type: 'explore' });
  }

  _addUpdateFeedConversation(conversation) {
    this._addConversation({ conversation, type: 'feed' });
  }

  _addUpdatePrivateConversation(conversation) {
    this._addConversation({ conversation, type: 'private' });
  }

  _addUpdateRecentConversation(conversation) {
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
    this._iterateConversationTypes(({ conversations, type }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        if (type === 'active') {
          const existingIndex = conversation.conversationMessages.findIndex(conversationMessage => {
            return conversationMessage.nonce && conversationMessage.nonce === message.nonce;
          });

          if (existingIndex !== -1) {
            conversation.conversationMessages[existingIndex] = message;
          } else {
            conversation.conversationMessages.push(message);
            conversation.conversationMessages.sort(this._conversationMessagesSorter);
          }
        } else {
          conversation.previewConversationMessage = message;
        }
      });
    });

    this._addUpdatePreviewConversation(conversationId);

    this._removeTypingUserFromConversation({ conversationId, userId: message.conversationUser.userId });
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
        conversation.conversationTypingUsers = conversation.conversationTypingUsers.filter(conversationTypingUser => {
          if (conversationTypingUser.id === user.id) {
            clearTimeout(conversationTypingUser.stoppedTypingTimeout);

            return false;
          }

          return true;
        }).sort(this._conversationTypingUsersSorter);

        conversation.conversationTypingUsers.push({
          ...user,
          stoppedTypingTimeout: setTimeout(() => this._removeTypingUserFromConversation({
            conversationId,
            userId: user.id,
          }), 2500),
        });
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

  _addAuthUserConversationRepostToConversation({ conversationId, repost }) {
    this._iterateConversationTypes(({ conversations }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        conversation.authUserConversationRepost = repost;
      });
    });
  }

  _removeAuthUserConversationRepostFromConversation(conversationId) {
    this._iterateConversationTypes(({ conversations }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        conversation.authUserConversationRepost = null;
      });
    });
  }

  _addUpdateConversationAuthConversationUser({ conversationId, conversationUser }) {
    this._iterateConversationTypes(({ conversations, type }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        conversation.authConversationUser = conversationUser;
      });
    });
  }

  _removeConversationAuthConversationUser(conversationId) {
    this._iterateConversationTypes(({ conversations, type }) => {
      conversations.forEach(conversation => {
        if (conversation.id !== conversationId) {
          return;
        }

        conversation.authConversationUser = null;
      });
    });
  }

  _buildUpdatedConversationsArray = ({ existingConversations, newConversations, queryParams }) => {
    if (!queryParams || (!queryParams.before && !queryParams.after && !queryParams.staler && !queryParams.newer)) {
      return newConversations;
    } else {
      if (queryParams.before || queryParams.staler) {
        return [ ...existingConversations, ...newConversations ];
      } else if (queryParams.after || queryParams.newer) {
        return [ ...newConversations, ...existingConversations ];
      }
    }
  }

  _buildUpdatedConversationMessagesArray = ({ existingMessages, newMessages, queryParams }) => {
    if (!queryParams || (!queryParams.before && !queryParams.after)) {
      return newMessages;
    } else {
      if (queryParams.before) {
        return [ ...existingMessages, ...newMessages ];
      } else if (queryParams.after) {
        return [ ...newMessages, ...existingMessages ];
      }
    }
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

  _getLoadedConversationById = conversationId => {
    let loadedConversation = null;

    this._iterateConversationTypes(({ conversations, type }) => {
      if (loadedConversation) {
        return;
      }

      conversations.forEach(conversation => {
        if (!loadedConversation && conversation.id === conversationId) {
          loadedConversation = conversation;
        }
      });
    }, false);

    return loadedConversation;
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

  _iterateConversationTypes = (iteratorFunction, updateStore = true) => {
    const { store } = this;
    const activeConversations = (store.activeConversations) ? [ ...store.activeConversations ] : null;
    const exploreConversations = (store.exploreConversations) ? [ ...store.exploreConversations ] : null;
    const feedConversations = (store.feedConversations) ? [ ...store.feedConversations ] : null;
    const privateConversations = (store.privateConversations) ? [ ...store.privateConversations ] : null;
    const recentConversations = (store.recentConversations) ? [ ...store.recentConversations ] : null;
    const usersConversations = (store.usersConversations) ? { ...store.usersConversations } : null;
    // could make this more DRY.
    if (Array.isArray(activeConversations)) {
      iteratorFunction({
        conversations: activeConversations,
        type: 'active',
      });
    }

    if (Array.isArray(exploreConversations)) {
      iteratorFunction({
        conversations: exploreConversations,
        type: 'explore',
      });
    }

    if (Array.isArray(feedConversations)) {
      iteratorFunction({
        conversations: feedConversations,
        type: 'feed',
      });
    }

    if (Array.isArray(privateConversations)) {
      iteratorFunction({
        conversations: privateConversations,
        type: 'private',
      });
    }

    if (Array.isArray(recentConversations)) {
      iteratorFunction({
        conversations: recentConversations,
        type: 'recent',
      });
    }

    if (typeof usersConversations === 'object') {
      Object.values(usersConversations).forEach(userConversations => {
        iteratorFunction({
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

  _addUpdatePreviewConversation = async conversationId => {
    const { apiHelper } = this.maestro.helpers;
    let previewConversation = null;

    this._iterateConversationTypes(({ conversations, type }) => {
      if (type !== 'active' && !previewConversation) {
        previewConversation = conversations.find(conversation => (
          conversation.id === conversationId
        ));
      }
    }, false);

    if (!previewConversation) {
      const response = await apiHelper.get({
        path: `/conversations/${conversationId}`,
        queryParams: { preview: true },
      });

      if (response.code !== 200 || !response.body.id) {
        return; // throw here?
      }

      previewConversation = response.body;
    }

    if (previewConversation.authConversationUser) {
      this._addUpdateRecentConversation(previewConversation);
    }

    if (previewConversation.accessLevel === 'private') {
      this._addUpdatePrivateConversation(previewConversation);
    }
  }

  _getAuthConversationUserFromActiveConversation = conversationId => {
    let authConversationUser = null;

    this._iterateConversationTypes(({ conversations, type }) => {
      if (type === 'active') { // refactor vv
        conversations.forEach(conversation => {
          if (conversation.id === conversationId) {
            authConversationUser = conversation.authConversationUser;
          }
        });
      }
    }, false);

    return authConversationUser;
  }

  _syncConversationEvents = () => {
    const { eventsManager } = this.maestro.managers;

    // maybe we should diff and unsubscribe from no longer loaded convos to reduce network overhead?
    // we probabably need to subscribe to all convos user is apart of?..

    this._iterateConversationTypes(({ conversations }) => {
      conversations.forEach(conversation => {
        eventsManager.subscribe(conversation.eventsTopic);
      });
    }, false);
  }
}
