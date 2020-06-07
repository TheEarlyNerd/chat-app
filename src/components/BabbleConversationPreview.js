import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { BabbleUserAvatar, BabbleUserAvatarGroup, BabbleReaction } from './';
import { EyeIcon, UsersIcon, UserIcon } from './icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { navigationHelper } = maestro.helpers;

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
    console.log(this.props.conversation);
    const { accessLevel, previewConversationUsers } = this.props.conversation;
    const loggedInUserId = userManager.store.user.id;

    if (accessLevel === 'public') {
      return [];
    }

    if (accessLevel === 'protected') {
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
      ? moment(previewConversationMessage.createdAt).calendar()
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
            disabled
            size={50}
          />
        )}

        <View style={styles.content}>
          <View style={styles.metadata}>
            <View style={styles.heading}>
              {accessLevel === 'protected' && (
                <UsersIcon width={14} height={14} style={styles.protectedIcon} />
              )}

              <Text style={styles.titleText} numberOfLines={1}>{this._getTitle()}</Text>
            </View>

            <View style={styles.stats}>
              {accessLevel !== 'private' && (
                <>
                  <View style={styles.stat}>
                    <UserIcon width={17} height={17} style={[ styles.statIcon, styles.statLiveColor ]} />
                    <Text style={[ styles.statText, styles.statLiveColor ]}>{usersCount}</Text>
                  </View>

                  <View style={styles.stat}>
                    <EyeIcon width={17} height={17} style={styles.statIcon} />
                    <Text style={styles.statText}>{impressionsCount}</Text>
                  </View>
                </>
              )}

              {unreadCount > 0 && (
                <View style={styles.unreadBubble}>
                  <Text style={styles.unreadCountText}>{unreadCount}</Text>

                  <LinearGradient
                    useAngle
                    angle={36}
                    colors={[ '#299BCB', '#1ACCB4' ]}
                    style={styles.unreadBubbleBackground}
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.preview}>
            <View style={styles.previewTexts}>
              <Text numberOfLines={3} style={[ styles.previewText, (unreadCount > 0) ? styles.previewUnreadColor : null ]}>{this._getPreviewText()}</Text>
              <Text style={styles.timeText}>{this._getTime()}</Text>
            </View>

            {!!previewImageUrl && (
              <FastImage
                source={{ uri: previewImageUrl }}
                style={styles.previewImage}
              />
            )}
          </View>

          {accessLevel !== 'private' && !!reactions?.length && (
            <View style={styles.reactions}>
              {reactions.map((reaction, index) => (
                <BabbleReaction
                  reaction={reaction}
                  count={reaction.count}
                  style={styles.reaction}
                  key={index}
                />
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  heading: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 20,
  },
  metadata: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preview: {
    flexDirection: 'row',
    marginTop: 4,
  },
  previewImage: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    height: 50,
    marginLeft: 10,
    marginTop: 4,
    width: 50,
  },
  previewText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  previewTexts: {
    flex: 1,
  },
  previewUnreadColor: {
    color: '#404040',
  },
  protectedIcon: {
    color: '#2A99CC',
    marginRight: 5,
    marginTop: -1.5,
  },
  reaction: {
    marginRight: 10,
    marginTop: 8,
  },
  reactions: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  statIcon: {
    color: '#797979',
    marginRight: 3,
  },
  statLiveColor: {
    color: '#FF4444',
  },
  statText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
  },
  stats: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  timeText: {
    color: '#97A1A4',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    marginTop: 4,
  },
  titleText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
  unreadBubble: {
    alignItems: 'center',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    marginLeft: 10,
    width: 20,
  },
  unreadBubbleBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    zIndex: -1,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
  },
});
