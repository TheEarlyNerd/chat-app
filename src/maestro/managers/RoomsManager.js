import { Manager } from 'react-native-maestro';

export default class RoomsManager extends Manager {
  static get instanceKey() {
    return 'roomsManager';
  }

  static initialStore = {
    activeRooms: null,
    exploreRooms: null,
    feedRooms: null,
    privateRooms: null,
    recentRooms: null,
    usersRooms: {},
    lastRoomsHash: '',
  }

  get storeName() {
    return 'rooms';
  }

  receiveStoreUpdate({ rooms }) {
    const { lastRoomsHash } = rooms;
    let hash = ''; // not a true hash, shrug, doesn't matter here.

    this._iterateRoomTypes(({ rooms }) => {
      rooms.forEach(room => hash += `${room.id}`);
    }, false);

    if (hash !== lastRoomsHash) {
      this.updateStore({ lastRoomsHash: hash });
      this._syncRoomEvents();
    }
  }

  async getRoomUsers(roomId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/rooms/${roomId}/users` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async getPrivateRoom({ userIds, phones }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/rooms',
      queryParams: { privateUserIds: userIds, privatePhones: phones },
    });

    if (![ 200, 204 ].includes(response.code)) {
      throw new Error(response.body);
    }

    const room = response.body || null;

    if (room) {
      room.roomMessages.sort(this._roomMessagesSorter);
    }

    return room;
  }

  getFocusedActiveRoom() {
    return this.store.activeRooms[0];
  }

  async loadActiveRoom(roomId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/rooms/${roomId}` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    response.body.roomMessages.sort(this._roomMessagesSorter);

    this._addUpdateActiveRoom(response.body);

    this.markRoomRead(response.body.id);

    return response.body;
  }

  async loadActiveRoomMessages({ roomId, queryParams }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: `/rooms/${roomId}/messages`,
      queryParams,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    const activeRooms = this._getRoomsByType('active');
    const activeRoom = activeRooms.find(room => room.id === roomId);

    activeRoom.roomMessages = this._buildUpdatedRoomMessagesArray({
      existingMessages: activeRoom.roomMessages,
      newMessages: response.body,
      queryParams,
    });

    this.updateStore({ activeRooms });

    return response.body;
  }

  async loadExploreRooms(queryParams) {
    return this._loadRooms({
      roomsKey: 'exploreRooms',
      queryParams,
    });
  }

  async loadFeedRooms(queryParams) {
    return this._loadRooms({
      roomsKey: 'feedRooms',
      queryParams: {
        feed: true,
        ...queryParams,
      },
    });
  }

  async loadPrivateRooms(queryParams) {
    return this._loadRooms({
      roomsKey: 'privateRooms',
      queryParams: {
        accessLevels: [ 'private' ],
        ...queryParams,
      },
    });
  }

  async loadRecentRooms(queryParams) {
    return await this._loadRooms({
      roomsKey: 'recentRooms',
      queryParams: {
        accessLevels: [ 'public', 'protected', 'private' ],
        ...queryParams,
      },
    });
  }

  async loadUsersRooms({ userId, queryParams }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: `/users/${userId}/rooms`,
      queryParams,
    });

    const usersRooms = { ...this.store.usersRooms };

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    usersRooms[userId] = this._buildUpdatedRoomsArray({
      existingRooms: usersRooms[userId],
      newRooms: response.body,
      queryParams,
    });

    this.updateStore({ usersRooms });

    return response.body;
  }

  async searchRooms(search) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/rooms',
      queryParams: { search },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async createRoom({ accessLevel, title, userIds, phoneUsers, message }) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const attachments = await this._createAttachments(message.attachments);
    const embeds = await this._createEmbedsFromText(message.text);
    const response = await apiHelper.post({
      path: '/rooms',
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

    this._addUpdateActiveRoom(response.body);
    this._addUpdateRecentRoom(response.body);

    if (accessLevel === 'private') {
      this._addUpdatePrivateRoom(response.body);
    } else {
      this._addUpdateExploreRoom(response.body);
    }

    this.markRoomRead(response.body.id);

    return response.body;
  }

  async createRoomMessage({ roomId, text, attachments, embeds }) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const message = {
      text: text.trim(),
      nonce: `${roomId}-${userManager.store.user.id}-${Date.now()}`,
    };

    this._addMessageToRoom({
      roomId,
      message: {
        ...message,
        attachments,
        embeds,
        roomUser: this._getAuthRoomUserFromActiveRoom(roomId) || {
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
      path: `/rooms/${roomId}/messages`,
      data: {
        ...message,
        attachmentIds: attachments.map(attachment => attachment.id),
        embedIds: embeds.map(embed => embed.id),
      },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addMessageToRoom({
      roomId,
      message: response.body,
    });

    this._addUpdateRoomAuthRoomUser({
      roomId,
      roomUser: response.body.roomUser,
    });

    this.markRoomRead(roomId);

    return response.body;
  }

  async createRoomMessageReaction({ roomId, roomMessageId, emoji }) {
    const { apiHelper } = this.maestro.helpers;
    const reaction = {
      reaction: emoji,
      optimistic: true,
    };

    this._addReactionToRoomMessage({
      roomId,
      roomMessageId,
      reaction,
    });

    const response = await apiHelper.put({
      path: `/rooms/${roomId}/messages/${roomMessageId}/reactions`,
      data: reaction,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addReactionToRoomMessage({
      roomId,
      roomMessageId,
      reaction: response.body,
    });

    return response.body;
  }

  async createRoomUser({ roomId, userId, phoneUser }) {
    const { apiHelper } = this.maestro.helpers;

    const response = await apiHelper.put({
      path: `/rooms/${roomId}/users`,
      data: {
        userId,
        phoneUser,
      },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    const room = this._getLoadedRoomById(roomId);

    this._updateRoom({
      roomId,
      fields: {
        usersCount: room.usersCount + 1,
      },
    });

    return response.body;
  }

  async createRoomRepost(roomId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.put({
      path: `/rooms/${roomId}/reposts`,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addAuthUserRoomRepostToRoom({
      roomId,
      repost: response.body,
    });

    return response.body;
  }

  async joinRoom(roomId) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;
    const response = await apiHelper.put({
      path: `/rooms/${roomId}/users`,
      data: { userId: userManager.store.user.id },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._addUpdateRoomAuthRoomUser({
      roomId,
      roomUser: response.body,
    });

    await this.markRoomRead(roomId);

    await this._addUpdatePreviewRoom(roomId);
  }

  async deleteRoom(roomId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/rooms/${roomId}`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }

    this._removeFromAllRoomTypes(roomId);
  }

  async deleteRoomMessage({ roomId, roomMessageId }) {
    this._removeMessageFromRoom({ roomId, roomMessageId });

    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/rooms/${roomId}/messages/${roomMessageId}`,
    });

    if (response.code !== 204) {
      // TODO: should probably re-add the message to UI if delete fails?
      throw new Error(response.body);
    }
  }

  async deleteRoomMessageReaction({ roomId, roomMessageId, roomMessageReactionId }) {
    this._removeReactionFromRoomMessage({
      roomId,
      roomMessageId,
      roomMessageReactionId,
    });

    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/rooms/${roomId}/messages/${roomMessageId}/reactions/${roomMessageReactionId}`,
    });

    if (response.code !== 204) {
      // TODO: should probably re-add the reaction to UI if delete fails
      throw new Error(response.body);
    }
  }

  async deleteRoomUser({ roomId, roomUserId }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/rooms/${roomId}/users/${roomUserId}`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }
  }

  async deleteRoomRepost(roomId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/rooms/${roomId}/reposts`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }

    this._removeAuthUserRoomRepostFromRoom(roomId);
  }

  async leaveRoom(roomId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({
      path: `/users/me/rooms/${roomId}`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }

    this._removeRoomAuthRoomUser(roomId);
    this._removePrivateRoom(roomId);
    this._removeRecentRoom(roomId);
  }

  async updateRoom({ roomId, fields }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.patch({
      path: `/rooms/${roomId}`,
      data: fields,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._updateRoom({ roomId, fields });
  }

  async createTypingEvent({ roomId }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.post({
      path: `/rooms/${roomId}/typing`,
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }
  }

  async markRoomRead(roomId) {
    const { apiHelper } = this.maestro.helpers;

    apiHelper.put({ path: `/users/me/rooms/${roomId}/data` });

    this._iterateRoomTypes(({ rooms, type }) => {
      if (type === 'active') {
        return;
      }

      rooms.forEach(room => {
        if (room.id === roomId) {
          room.authUserRoomData = {
            lastReadAt: new Date(),
          };
        }
      });
    });
  }

  removeUsersRooms(userId) {
    this._removeUsersRooms(userId);
  }

  /*
   * Helpers
   */

  async _loadRooms({ roomsKey, queryParams }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: '/rooms', queryParams });
    const rooms = this.store[roomsKey];

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this.updateStore({
      [roomsKey]: this._buildUpdatedRoomsArray({
        existingRooms: rooms,
        newRooms: response.body,
        queryParams,
      }),
    });

    return response.body;
  }

  _addUpdateActiveRoom(room) {
    this._addRoom({ room, type: 'active' });
  }

  _addUpdateExploreRoom(room) {
    this._addRoom({ room, type: 'explore' });
  }

  _addUpdateFeedRoom(room) {
    this._addRoom({ room, type: 'feed' });
  }

  _addUpdatePrivateRoom(room) {
    this._addRoom({ room, type: 'private' });
  }

  _addUpdateRecentRoom(room) {
    this._addRoom({ room, type: 'recent' });
  }

  _addRoom({ room, type }) {
    let typeRooms = this._getRoomsByType(type);

    typeRooms = typeRooms.filter(typeRoom => (
      typeRoom.id !== room.id
    ));

    if (type !== 'explore' && typeRooms.length >= 5) {
      typeRooms.pop();
    }

    typeRooms.unshift(room);

    this._updateRoomsByType({
      rooms: typeRooms,
      type,
    });
  }

  _removeFromAllRoomTypes(roomId) {
    this._removeActiveRoom(roomId);
    this._removeExploreRoom(roomId);
    this._removeFeedRoom(roomId);
    this._removePrivateRoom(roomId);
    this._removeRecentRoom(roomId);
    this._removeUsersRoom(roomId);
  }

  _removeActiveRoom(roomId) {
    this._removeRoom({ roomId, type: 'active' });
  }

  _removeExploreRoom(roomId) {
    this._removeRoom({ roomId, type: 'explore' });
  }

  _removeFeedRoom(roomId) {
    this._removeRoom({ roomId, type: 'feed' });
  }

  _removePrivateRoom(roomId) {
    this._removeRoom({ roomId, type: 'private' });
  }

  _removeRecentRoom(roomId) {
    this._removeRoom({ roomId, type: 'recent' });
  }

  _removeUsersRoom(roomId) {
    this._removeRoom({ roomId, type: 'users' });
  }

  _removeRoom({ roomId, type }) {
    let typeRooms = this._getRoomsByType(type);

    if (type !== 'users') {
      typeRooms = typeRooms.filter(typeRoom => (
        typeRoom.id !== roomId
      ));
    } else {
      Object.keys(typeRooms).forEach(userId => {
        typeRooms[userId] = typeRooms[userId].filter(userRoom => (
          userRoom.id !== roomId
        ));
      });
    }

    this._updateRoomsByType({
      rooms: typeRooms,
      type,
    });
  }

  _updateRoom({ roomId, fields }) {
    this._iterateRoomTypes(({ rooms }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        Object.assign(room, fields);
      });
    });
  }

  _addMessageToRoom({ roomId, message }) {
    this._iterateRoomTypes(({ rooms, type }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        if (type === 'active') {
          const existingIndex = room.roomMessages.findIndex(roomMessage => {
            return roomMessage.nonce && roomMessage.nonce === message.nonce;
          });

          if (existingIndex !== -1) {
            room.roomMessages[existingIndex] = message;
          } else {
            room.roomMessages.push(message);
            room.roomMessages.sort(this._roomMessagesSorter);
          }
        } else {
          room.previewRoomMessage = message;
        }
      });
    });

    this._addUpdatePreviewRoom(roomId);

    this._removeTypingUserFromRoom({ roomId, userId: message.roomUser.userId });
  }

  _removeMessageFromRoom({ roomId, roomMessageId }) {
    this._iterateRoomTypes(({ rooms, type }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        if (type === 'active') {
          room.roomMessages = room.roomMessages.filter(roomMessage => (
            (roomMessage.id !== roomMessageId)
          )).sort(this._roomMessagesSorter);
        } else {
          room.previewRoomMessage = null;
        }
      });
    });
  }

  _addReactionToRoomMessage({ roomId, roomMessageId, reaction }) {
    const { userManager } = this.maestro.managers;
    const loggedInUserId = userManager.store.user.id;

    this._iterateRoomTypes(({ rooms, type }) => {
      if (type !== 'active') {
        return;
      }

      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        const roomMessage = room.roomMessages.find(roomMessage => (
          roomMessage.id === roomMessageId
        ));

        if (!roomMessage) {
          return;
        }

        roomMessage.authUserRoomMessageReactions = roomMessage.authUserRoomMessageReactions || [];
        roomMessage.roomMessageReactions = roomMessage.roomMessageReactions || [];

        const { authUserRoomMessageReactions, roomMessageReactions } = roomMessage;

        const authUserRoomMessageReactionIndex = authUserRoomMessageReactions.findIndex(roomMessageReaction => (
          roomMessageReaction.reaction === reaction.reaction
        ));

        if (!reaction.userId || reaction.userId === loggedInUserId) {
          if (authUserRoomMessageReactionIndex !== -1) {
            authUserRoomMessageReactions[authUserRoomMessageReactionIndex] = reaction;
          } else {
            authUserRoomMessageReactions.push(reaction);
          }
        }

        const roomMessageReaction = roomMessageReactions.find(roomMessageReaction => (
          roomMessageReaction.reaction === reaction.reaction
        ));

        if (roomMessageReaction && !roomMessageReaction?.createUserIds?.includes(reaction.userId)) {
          roomMessageReaction.createUserIds = roomMessageReaction.createUserIds || [];
          roomMessageReaction.createUserIds.push(reaction.userId || loggedInUserId);

          if (roomMessageReaction.deleteUserIds) {
            roomMessageReaction.deleteUserIds = roomMessageReaction.deleteUserIds.filter(deleteUserId => (
              deleteUserId !== reaction.userId
            ));
          }

          roomMessageReaction.count++;
        } else if (!roomMessageReaction) {
          roomMessageReactions.push({
            reaction: reaction.reaction,
            createUserIds: (reaction.userId) ? [ reaction.userId ] : [ loggedInUserId ],
            count: 1,
          });
        }
      });
    });
  }

  _removeReactionFromRoomMessage({ roomId, roomMessageId, roomMessageReactionId, userId, reaction }) {
    const { userManager } = this.maestro.managers;
    const loggedInUserId = userManager.store.user.id;

    this._iterateRoomTypes(({ rooms, type }) => {
      if (type !== 'active') {
        return;
      }

      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        const roomMessage = room.roomMessages.find(roomMessage => (
          roomMessage.id === roomMessageId
        ));

        if (!roomMessage) {
          return;
        }

        const authUserRoomMessageReactions = roomMessage.authUserRoomMessageReactions || [];
        const roomMessageReactions = roomMessage.roomMessageReactions || [];
        const relevantAuthUserRoomMessageReaction = authUserRoomMessageReactions.find(roomMessageReaction => (
          (roomMessageReactionId && roomMessageReaction.id === roomMessageReactionId) ||
          (userId === loggedInUserId && roomMessageReaction.reaction === reaction)
        ));

        roomMessage.authUserRoomMessageReactions = authUserRoomMessageReactions.filter(roomMessageReaction => (
          roomMessageReaction.id !== relevantAuthUserRoomMessageReaction?.id
        ));

        const relevantRoomMessageReaction = roomMessageReactions.find(roomMessageReaction => (
          roomMessageReaction.reaction === relevantAuthUserRoomMessageReaction?.reaction ||
          roomMessageReaction.reaction === reaction
        ));

        if (!relevantRoomMessageReaction || (userId && relevantRoomMessageReaction?.deleteUserIds?.includes(userId))) {
          return;
        }

        if (relevantRoomMessageReaction.count > 1) {
          relevantRoomMessageReaction.deleteUserIds = relevantRoomMessageReaction.deleteUserIds || [];
          relevantRoomMessageReaction.deleteUserIds.push(userId || loggedInUserId);

          if (relevantRoomMessageReaction.createUserIds) {
            relevantRoomMessageReaction.createUserIds = relevantRoomMessageReaction.createUserIds.filter(createUserId => (
              createUserId !== userId
            ));
          }

          relevantRoomMessageReaction.count--;
        } else {
          roomMessage.roomMessageReactions = roomMessageReactions.filter(roomMessageReaction => (
            roomMessageReaction.reaction !== relevantRoomMessageReaction.reaction
          ));
        }
      });
    });
  }

  _addTypingUserToRoom({ roomId, user }) {
    const loggedInUserId = this.maestro.managers.userManager.store.user.id;

    if (user.id === loggedInUserId) {
      return;
    }

    this._iterateRoomTypes(({ rooms, type }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        room.roomTypingUsers = room.roomTypingUsers || [];
        room.roomTypingUsers = room.roomTypingUsers.filter(roomTypingUser => {
          if (roomTypingUser.id === user.id) {
            clearTimeout(roomTypingUser.stoppedTypingTimeout);

            return false;
          }

          return true;
        }).sort(this._roomTypingUsersSorter);

        room.roomTypingUsers.push({
          ...user,
          stoppedTypingTimeout: setTimeout(() => this._removeTypingUserFromRoom({
            roomId,
            userId: user.id,
          }), 2500),
        });
      });
    });
  }

  _removeTypingUserFromRoom({ roomId, userId }) {
    this._iterateRoomTypes(({ rooms }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        room.roomTypingUsers = room.roomTypingUsers || [];
        room.roomTypingUsers = room.roomTypingUsers.filter(roomTypingUser => (
          roomTypingUser.id !== userId
        )).sort(this._roomTypingUsersSorter);
      });
    });
  }

  _addAuthUserRoomRepostToRoom({ roomId, repost }) {
    this._iterateRoomTypes(({ rooms }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        room.authUserRoomRepost = repost;
      });
    });
  }

  _removeAuthUserRoomRepostFromRoom(roomId) {
    this._iterateRoomTypes(({ rooms }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        room.authUserRoomRepost = null;
      });
    });
  }

  _addUpdateRoomAuthRoomUser({ roomId, roomUser }) {
    this._iterateRoomTypes(({ rooms, type }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        room.authRoomUser = roomUser;
      });
    });
  }

  _removeRoomAuthRoomUser(roomId) {
    this._iterateRoomTypes(({ rooms, type }) => {
      rooms.forEach(room => {
        if (room.id !== roomId) {
          return;
        }

        room.authRoomUser = null;
      });
    });
  }

  _buildUpdatedRoomsArray = ({ existingRooms, newRooms, queryParams }) => {
    if (!queryParams || (!queryParams.before && !queryParams.after && !queryParams.staler && !queryParams.newer)) {
      return newRooms;
    } else {
      if (queryParams.before || queryParams.staler) {
        return [ ...existingRooms, ...newRooms ];
      } else if (queryParams.after || queryParams.newer) {
        return [ ...newRooms, ...existingRooms ];
      }
    }
  }

  _buildUpdatedRoomMessagesArray = ({ existingMessages, newMessages, queryParams }) => {
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

  _getRoomsByType = type => {
    const { store } = this;

    if (type === 'active') {
      return (store.activeRooms) ? [ ...store.activeRooms ] : [];
    }

    if (type === 'explore') {
      return (store.exploreRooms) ? [ ...store.exploreRooms ] : [];
    }

    if (type === 'feed') {
      return (store.feedRooms) ? [ ...store.feedRooms ] : [];
    }

    if (type === 'private') {
      return (store.privateRooms) ? [ ...store.privateRooms ] : [];
    }

    if (type === 'recent') {
      return (store.recentRooms) ? [ ...store.recentRooms ] : [];
    }

    if (type === 'users') {
      return (store.usersRooms) ? { ...this.store.usersRooms } : {};
    }
  }

  _getLoadedRoomById = roomId => {
    let loadedRoom = null;

    this._iterateRoomTypes(({ rooms, type }) => {
      if (loadedRoom) {
        return;
      }

      rooms.forEach(room => {
        if (!loadedRoom && room.id === roomId) {
          loadedRoom = room;
        }
      });
    }, false);

    return loadedRoom;
  }

  _updateRoomsByType = ({ rooms, type }) => {
    this.updateStore({
      activeRooms: (type === 'active') ? rooms : this.store.activeRooms,
      exploreRooms: (type === 'explore') ? rooms : this.store.exploreRooms,
      feedRooms: (type === 'feed') ? rooms : this.store.feedRooms,
      privateRooms: (type === 'private') ? rooms : this.store.privateRooms,
      recentRooms: (type === 'recent') ? rooms : this.store.recentRooms,
      usersRooms: (type === 'users') ? rooms : this.store.usersRooms,
    });
  }

  _iterateRoomTypes = (iteratorFunction, updateStore = true) => {
    const { store } = this;
    const activeRooms = (store.activeRooms) ? [ ...store.activeRooms ] : null;
    const exploreRooms = (store.exploreRooms) ? [ ...store.exploreRooms ] : null;
    const feedRooms = (store.feedRooms) ? [ ...store.feedRooms ] : null;
    const privateRooms = (store.privateRooms) ? [ ...store.privateRooms ] : null;
    const recentRooms = (store.recentRooms) ? [ ...store.recentRooms ] : null;
    const usersRooms = (store.usersRooms) ? { ...store.usersRooms } : null;
    // could make this more DRY.
    if (Array.isArray(activeRooms)) {
      iteratorFunction({
        rooms: activeRooms,
        type: 'active',
      });
    }

    if (Array.isArray(exploreRooms)) {
      iteratorFunction({
        rooms: exploreRooms,
        type: 'explore',
      });
    }

    if (Array.isArray(feedRooms)) {
      iteratorFunction({
        rooms: feedRooms,
        type: 'feed',
      });
    }

    if (Array.isArray(privateRooms)) {
      iteratorFunction({
        rooms: privateRooms,
        type: 'private',
      });
    }

    if (Array.isArray(recentRooms)) {
      iteratorFunction({
        rooms: recentRooms,
        type: 'recent',
      });
    }

    if (typeof usersRooms === 'object') {
      Object.values(usersRooms).forEach(userRooms => {
        iteratorFunction({
          rooms: userRooms,
          type: 'users',
        });
      });
    }

    if (updateStore) {
      this.updateStore({
        activeRooms,
        exploreRooms,
        feedRooms,
        privateRooms,
        recentRooms,
        usersRooms,
      });
    }
  }

  _roomMessagesSorter = (roomMessageA, roomMessageB) => {
    if (roomMessageA.createdAt < roomMessageB.createdAt) {
      return 1;
    }

    if (roomMessageA.createdAt > roomMessageB.createdAt) {
      return -1;
    }

    return 0;
  }

  _roomTypingUsersSorter = (roomTypingUserA, roomTypingUserB) => {
    return roomTypingUserA.typingAt > roomTypingUserB.typingAt ? -1 : 1;
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

  _addUpdatePreviewRoom = async roomId => {
    const { apiHelper } = this.maestro.helpers;
    let previewRoom = null;

    this._iterateRoomTypes(({ rooms, type }) => {
      if (type !== 'active' && !previewRoom) {
        previewRoom = rooms.find(room => (
          room.id === roomId
        ));
      }
    }, false);

    if (!previewRoom) {
      const response = await apiHelper.get({
        path: `/rooms/${roomId}`,
        queryParams: { preview: true },
      });

      if (response.code !== 200 || !response.body.id) {
        return; // throw here?
      }

      previewRoom = response.body;
    }

    if (previewRoom.authRoomUser) {
      this._addUpdateRecentRoom(previewRoom);
    }

    if (previewRoom.accessLevel === 'private') {
      this._addUpdatePrivateRoom(previewRoom);
    }
  }

  _getAuthRoomUserFromActiveRoom = roomId => {
    let authRoomUser = null;

    this._iterateRoomTypes(({ rooms, type }) => {
      if (type === 'active') { // refactor vv
        rooms.forEach(room => {
          if (room.id === roomId) {
            authRoomUser = room.authRoomUser;
          }
        });
      }
    }, false);

    return authRoomUser;
  }

  _syncRoomEvents = () => {
    const { eventsManager } = this.maestro.managers;

    // maybe we should diff and unsubscribe from no longer loaded convos to reduce network overhead?
    // we probabably need to subscribe to all convos user is apart of?..

    this._iterateRoomTypes(({ rooms }) => {
      rooms.forEach(room => {
        eventsManager.subscribe(room.eventsTopic);
      });
    }, false);
  }
}
