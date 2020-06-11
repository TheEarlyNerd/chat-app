import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BabbleUserAvatar, BabbleUserAvatarGroup, BabbleReaction } from './';
import { EyeIcon, UsersIcon, UserIcon } from './icons';
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

  _getReactions = () => {
    const { previewConversationMessage } = this.props.conversation;

    return (previewConversationMessage)
      ? previewConversationMessage.conversationMessageReactions
      : null;
  }

  _getTime = () => {
    const { previewConversationMessage } = this.props.conversation;

    return (previewConversationMessage)
      ? timeHelper.fromNow(previewConversationMessage.createdAt)
      : null;
  }

  render() {
    const { conversation, style } = this.props;
    const { accessLevel, usersCount, impressionsCount } = conversation;
    const groupUsers = this._getGroupUsers();
    const reactions = this._getReactions();
    const previewImageUrl = this._getPreviewImageUrl();
    const unreadCount = 0;

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
          <Text style={styles.titleText} numberOfLines={1}>{this._getTitle()}</Text>

          <View style={styles.previewTexts}>
            <Text numberOfLines={1} style={[ styles.previewText, styles.previewMessageText ]}>
              {this._getPreviewText()}
            </Text>
            <Text style={[ styles.previewText, styles.previewBulletText, styles.inflexibleText ]}>•</Text>
            <Text style={[ styles.previewText, styles.inflexibleText ]}>{this._getTime()}</Text>
          </View>
        </View>

        {!!previewImageUrl && (
          <View style={styles.attachment}>
            <FastImage
              source={{ uri: previewImageUrl }}
              style={styles.previewImage}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  attachment: {
    marginLeft: 5,
  },
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  inflexibleText: {
    flex: 0,
  },
  previewBulletText: {
    fontSize: 10,
    paddingHorizontal: 3,
    paddingTop: 2.5,
  },
  previewImage: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    height: 50,
    marginLeft: 10,
    width: 50,
  },
  previewMessageText: {
    flexShrink: 1,
  },
  previewText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 13,
  },
  previewTextUnread: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
  },
  previewTexts: {
    flex: 1,
    flexDirection: 'row',
  },
  titleText: {
    color: '#404040',
    fontFamily: 'NunitoSans-ExtraBold',
    fontSize: 15,
    marginBottom: 2,
    marginTop: 5,
  },
});
