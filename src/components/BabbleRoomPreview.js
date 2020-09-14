import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import { BabbleUserAvatar, BabbleUserAvatarGroup } from './';
import { MessageCircleIcon, UsersIcon, LockIcon, RepeatIcon } from './icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { navigationHelper, interfaceHelper, timeHelper } = maestro.helpers;

export default class BabbleRoomPreview extends Component {
  static contextType = NavigationTypeContext;

  _onPress = () => {
    const { room } = this.props;

    if (this.context === 'sidebar') {
      navigationHelper.reset('Room', {
        backEnabled: false,
        roomId: room.id,
      }, 'content');
    } else {
      navigationHelper.navigate('Room', { roomId: room.id });
    }
  }

  _getAvatarAttachment = () => {
    const { accessLevel, user, previewRoomUsers } = this.props.room;
    const loggedInUserId = userManager.store.user.id;

    if ([ 'public', 'protected' ].includes(accessLevel)) {
      return user.avatarAttachment;
    }

    if (accessLevel === 'private') {
      const otherUser = previewRoomUsers.map(roomUser => (
        roomUser.user
      )).find(user => user.id !== loggedInUserId);

      return (otherUser) ? otherUser.avatarAttachment : user.avatarAttachment;
    }
  }

  _getGroupUsers = () => {
    const { accessLevel, previewRoomUsers } = this.props.room;
    const loggedInUserId = userManager.store.user.id;

    if ([ 'public', 'protected' ].includes(accessLevel)) {
      return previewRoomUsers.filter(roomUser => (
        roomUser.permissions.includes('ROOM_ADMIN') ||
        roomUser.permissions.includes('ROOM_MESSAGES_CREATE')
      )).map(roomUser => roomUser.user);
    }

    if (accessLevel === 'private') {
      return previewRoomUsers.filter(roomUser => (
        roomUser.userId !== loggedInUserId
      )).map(roomUser => roomUser.user);
    }
  }

  _getLastActiveAt = () => {
    const { accessLevel, user, previewRoomUsers } = this.props.room;
    const loggedInUserId = userManager.store.user.id;

    if (accessLevel === 'private') {
      const otherUser = previewRoomUsers.map(roomUser => (
        roomUser.user
      )).find(user => user.id !== loggedInUserId);

      return (otherUser) ? otherUser.lastActiveAt : user.lastActiveAt;
    } else {
      return user.lastActiveAt;
    }
  }

  _getTitle = () => {
    const { user, title } = this.props.room;

    if (title) {
      return title;
    }

    return this._getGroupUsers().map(user => user.name).join(', ') || user.name;
  }

  _getPreviewText = () => {
    const loggedInUserId = userManager.store.user.id;
    const { previewRoomMessage } = this.props.room;
    const roomTypingUsers = this.props.room.roomTypingUsers || [];

    if (roomTypingUsers.length > 0 && (!previewRoomMessage || previewRoomMessage.createdAt < roomTypingUsers[0].typingAt)) {
      return (roomTypingUsers.length > 1)
        ? `${roomTypingUsers[0].name} & ${roomTypingUsers.length - 1} others are typing...`
        : `${roomTypingUsers[0].name} is typing...`;
    }

    if (!previewRoomMessage) {
      return '(Deleted Message)';
    }

    const { roomUser, text } = previewRoomMessage;
    const authorIsLoggedInUser = roomUser.userId === loggedInUserId;
    const name = (authorIsLoggedInUser) ? 'You' : roomUser.user.name;

    if (authorIsLoggedInUser) {
      return (text) ? `You: ${text}` : 'You sent an attachment(s).';
    }

    return (text) ? `${name}: ${text}` : `${name} sent an attachment(s).`;
  }

  _getTime = () => {
    const { room } = this.props;
    const { previewRoomMessage } = room;

    return (previewRoomMessage)
      ? timeHelper.fromNow(previewRoomMessage.createdAt)
      : timeHelper.fromNow(room.lastMessageAt);
  }

  _isUnread = () => {
    const { authUserRoomData, previewRoomMessage } = this.props.room;

    if (!previewRoomMessage) {
      return false;
    }

    return !authUserRoomData || authUserRoomData.lastReadAt < previewRoomMessage.createdAt;
  }

  render() {
    const { room, style } = this.props;
    const { accessLevel, roomRepostUser, usersCount } = room;
    const groupUsers = this._getGroupUsers();

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[ styles.container, style ]}
      >
        {groupUsers.length < 2 && (
          <BabbleUserAvatar
            avatarAttachment={this._getAvatarAttachment()}
            lastActiveAt={this._getLastActiveAt()}
            statusIconStyle={styles.avatarActivityIcon}
            disabled
            size={50}
          />
        )}

        {groupUsers.length >= 2 && (
          <BabbleUserAvatarGroup
            users={groupUsers}
            usersCount={usersCount}
            disabled
            size={50}
          />
        )}

        <View style={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.titleText} numberOfLines={2}>{this._getTitle()}</Text>

            <View style={styles.headingRight}>
              {!!roomRepostUser && (
                <>
                  <RepeatIcon width={15} height={15} style={styles.repostIcon} />
                  <Text style={[ styles.headingRightText, styles.bulletText ]}>•</Text>
                </>
              )}

              {accessLevel === 'public' && (
                <MessageCircleIcon width={15} height={15} style={styles.accessLevelIcon} />
              )}

              {accessLevel === 'protected' && (
                <UsersIcon width={15} height={15} style={styles.accessLevelIcon} />
              )}

              {accessLevel === 'private' && (
                <LockIcon width={15} height={15} style={styles.accessLevelIcon} />
              )}

              <Text style={[ styles.headingRightText, styles.bulletText ]}>•</Text>
              <Text style={[ styles.headingRightText ]}>{this._getTime()}</Text>
            </View>
          </View>

          <View style={styles.preview}>
            <Text
              numberOfLines={1}
              style={[
                styles.previewText,
                (this._isUnread()) ? styles.previewTextUnread : null,
              ]}
            >
              {this._getPreviewText()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  accessLevelIcon: {
    color: '#797979',
    marginTop: 1,
  },
  avatarActivityIcon: {
    borderRadius: 10,
    height: 13,
    width: 13,
  },
  bulletText: {
    fontSize: 10,
    paddingHorizontal: 3,
    paddingTop: 1.5,
  },
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
    minHeight: 50,
  },
  heading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headingRight: {
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 1,
  },
  headingRightText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 13, lg: 14 }),
  },
  preview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewText: {
    color: '#797979',
    flexShrink: 1,
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 14, lg: 15 }),
    lineHeight: 18,
    marginTop: 1,
  },
  previewTextUnread: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
  },
  repostIcon: {
    color: '#1ACCB4',
    marginTop: 1,
  },
  titleText: {
    color: '#404040',
    flex: 1,
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 17, lg: 18 }),
    lineHeight: 20,
  },
});
