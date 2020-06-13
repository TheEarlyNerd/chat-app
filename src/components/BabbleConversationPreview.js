import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BabbleUserAvatar, BabbleUserAvatarGroup } from './';
import { MessageCircleIcon, UsersIcon, LockIcon, ChevronRightIcon } from './icons';
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

    if (accessLevel === 'public') {
//      return [];
    }

    if (['public','protected'].includes(accessLevel)) {
      return previewConversationUsers.filter(conversationUser => (
        conversationUser.permissions.includes('CONVERSATION_ADMIN') ||
        conversationUser.permissions.includes('CONVERSATION_MESSAGES_CREATE')
      )).map(conversationUser => conversationUser.user);
    }

    if (accessLevel === 'private') {
      return previewConversationUsers.map(conversationUser => (
        conversationUser.user
      )).filter(user => user.id !== loggedInUserId);
    }
  }

  _getTitle = () => {
    const { accessLevel, user, title } = this.props.conversation;

    if (title) {
      return title;
    }

    if (accessLevel === 'public') {
      return user.name;
    }

    if ([ 'protected', 'private' ].includes(accessLevel)) {
      return this._getGroupUsers().map(user => user.name).join(', ') || user.name;
    }
  }

  _getPreviewImageUrl = () => {
    const { conversation } = this.props;
    const previewConversationMessage = conversation.previewConversationMessage || {};
    const { attachments, embeds } = previewConversationMessage;
    let previewImageUrl = null;

    if (attachments?.length) {
      const previewAttachment = attachments.find(attachment => {
        if (attachment.mimetype.includes('image/')) {
          return true;
        }
      });

      previewImageUrl = (previewAttachment) ? previewAttachment.url : null;
    }

    if (embeds?.length) {
      const previewEmbed = embeds.find(embed => !!embed.imageUrl);

      previewImageUrl = (previewEmbed) ? previewEmbed.imageUrl : null;
    }

    return previewImageUrl;
  }

  _getPreviewText = () => {
    const { previewConversationMessage } = this.props.conversation;

    if (!previewConversationMessage) {
      return '(Deleted Message)';
    }

    const { user, text } = previewConversationMessage;
    const loggedInUserId = userManager.store.user.id;
    const authorIsLoggedInUser = user.id === loggedInUserId;
    const name = (authorIsLoggedInUser) ? 'You' : user.name;

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

  render() {
    const { conversation, style } = this.props;
    const { accessLevel, usersCount } = conversation;
    const groupUsers = this._getGroupUsers();
    const previewImageUrl = this._getPreviewImageUrl();

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[ styles.container, style ]}
      >
        {groupUsers.length < 2 && (
          <BabbleUserAvatar
            avatarAttachment={this._getAvatarAttachment()}
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
            <Text numberOfLines={2} style={styles.previewText}>{this._getPreviewText()}</Text>
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
  titleText: {
    color: '#404040',
    flex: 1,
    fontFamily: 'NunitoSans-Bold',
    fontSize: 15,
    marginBottom: 1,
  },
});
