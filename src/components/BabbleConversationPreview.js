import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleUserAvatar, BabbleUserAvatarGroup } from './';
import { MessageCircleIcon, UsersIcon, LockIcon, RepeatIcon } from './icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { navigationHelper, timeHelper } = maestro.helpers;

export default class BabbleConversationPreview extends Component {
  _onPress = () => {
    const { conversation } = this.props;

    navigationHelper.push('Conversation', { conversationId: conversation.id });
  }

  _getAvatarAttachment = () => {
    const { accessLevel, user, previewConversationUsers } = this.props.conversation;
    const loggedInUserId = userManager.store.user.id;

    if ([ 'public', 'protected' ].includes(accessLevel)) {
      return user.avatarAttachment;
    }

    if (accessLevel === 'private') {
      const otherUser = previewConversationUsers.map(conversationUser => (
        conversationUser.user
      )).find(user => user.id !== loggedInUserId);

      return (otherUser) ? otherUser.avatarAttachment : user.avatarAttachment;
    }
  }

  _getGroupUsers = () => {
    const { accessLevel, previewConversationUsers } = this.props.conversation;
    const loggedInUserId = userManager.store.user.id;

    if ([ 'public', 'protected' ].includes(accessLevel)) {
      return previewConversationUsers.filter(conversationUser => (
        conversationUser.permissions.includes('CONVERSATION_ADMIN') ||
        conversationUser.permissions.includes('CONVERSATION_MESSAGES_CREATE')
      )).map(conversationUser => conversationUser.user);
    }

    if (accessLevel === 'private') {
      return previewConversationUsers.filter(conversationUser => (
        conversationUser.userId !== loggedInUserId
      )).map(conversationUser => conversationUser.user);
    }
  }

  _getLastActiveAt = () => {
    const { accessLevel, user, previewConversationUsers } = this.props.conversation;
    const loggedInUserId = userManager.store.user.id;

    if (accessLevel === 'private') {
      const otherUser = previewConversationUsers.map(conversationUser => (
        conversationUser.user
      )).find(user => user.id !== loggedInUserId);

      return (otherUser) ? otherUser.lastActiveAt : user.lastActiveAt;
    } else {
      return user.lastActiveAt;
    }
  }

  _getTitle = () => {
    const { user, title } = this.props.conversation;

    if (title) {
      return title;
    }

    return this._getGroupUsers().map(user => user.name).join(', ') || user.name;
  }

  _getPreviewText = () => {
    const loggedInUserId = userManager.store.user.id;
    const { previewConversationMessage } = this.props.conversation;
    const conversationTypingUsers = this.props.conversation.conversationTypingUsers || [];

    if (conversationTypingUsers.length > 0 && (!previewConversationMessage || previewConversationMessage.createdAt < conversationTypingUsers[0].typingAt)) {
      return (conversationTypingUsers.length > 1)
        ? `${conversationTypingUsers[0].name} & ${conversationTypingUsers.length - 1} others are typing...`
        : `${conversationTypingUsers[0].name} is typing...`;
    }

    if (!previewConversationMessage) {
      return '(Deleted Message)';
    }

    const { conversationUser, text } = previewConversationMessage;
    const authorIsLoggedInUser = conversationUser.userId === loggedInUserId;
    const name = (authorIsLoggedInUser) ? 'You' : conversationUser.user.name;

    if (authorIsLoggedInUser) {
      return (text) ? `You: ${text}` : 'You sent an attachment(s).';
    }

    return (text) ? `${name}: ${text}` : `${name} sent an attachment(s).`;
  }

  _getTime = () => {
    const { previewConversationMessage } = this.props.conversation;

    return (previewConversationMessage)
      ? timeHelper.fromNow(previewConversationMessage.createdAt)
      : null;
  }

  _isUnread = () => {
    const { authUserConversationData, previewConversationMessage } = this.props.conversation;

    if (!previewConversationMessage) {
      return false;
    }

    return !authUserConversationData || authUserConversationData.lastReadAt < previewConversationMessage.createdAt;
  }

  render() {
    const { conversation, style } = this.props;
    const { accessLevel, conversationRepostUser, usersCount } = conversation;
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
            <Text style={styles.titleText} numberOfLines={1}>{this._getTitle()}</Text>

            <View style={styles.headingRight}>
              {!!conversationRepostUser && (
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
              numberOfLines={2}
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
  bulletText: {
    fontSize: 10,
    paddingHorizontal: 3,
    paddingTop: 1.5,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headingRight: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  headingRightText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 13,
  },
  preview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewText: {
    color: '#797979',
    flexShrink: 1,
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 13,
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
    fontSize: 15,
    marginBottom: 1,
  },
});
