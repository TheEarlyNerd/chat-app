import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform, Dimensions, Keyboard, Linking } from 'react-native';
import moment from 'moment';
import ParsedText from 'react-native-parsed-text';
import { BabbleConversationMessageAttachment, BabbleConversationMessageEmbed, BabbleUserAvatar, BabbleReaction } from './';
import maestro from '../maestro';

const windowWidth = Dimensions.get('window').width;

const { conversationsManager } = maestro.managers;
const { interfaceHelper, navigationHelper } = maestro.helpers;

export default class BabbleConversationMessage extends Component {
  _getText = () => {
    const { message: { text, embeds = [] } } = this.props;
    const linklessText = embeds.reduce((linklessText, embed) => {
      return linklessText.replace(embed.url, '');
    }, text || '').trim();

    return (linklessText.length) ? text : '';
  }

  _userPress = userId => {
    navigationHelper.push('ProfileNavigator', {
      screen: 'Profile',
      params: { userId },
    });
  }

  _openUrl = url => {
    Keyboard.dismiss();

    navigationHelper.push('WebBrowserNavigator', {
      screen: 'WebBrowser',
      params: { url },
    });
  }

  _phonePress = phone => {
    Linking.openURL(Platform.select({
      ios: `tel:${phone}`,
      android: `telprompt:${phone}`,
    }));
  }

  _emailPress = email => {
    Linking.openURL(`mailto:${email}`);
  }

  _reactionPress = reaction => {
    const { message: { id, conversationId, authUserConversationMessageReactions } } = this.props;
    const authReaction = authUserConversationMessageReactions.find(authReaction => (
      authReaction.reaction === reaction.reaction
    ));

    if (!authReaction) {
      conversationsManager.createConversationMessageReaction({
        conversationId,
        conversationMessageId: id,
        emoji: reaction.reaction,
      });
    } else {
      conversationsManager.deleteConversationMessageReaction({
        conversationId,
        conversationMessageId: id,
        conversationMessageReactionId: authReaction.id,
      });
    }
  }

  _openAttachment = selectedIndex => {
    const { message: { attachments } } = this.props;

    this._openMediaViewer({ media: attachments, selectedIndex });
  }

  _openEmbed = embed => {
    const { url, mimetype } = embed;

    if (mimetype.includes('image/') || mimetype.includes('video/')) {
      this._openMediaViewer({
        media: [ { url, mimetype } ],
        selectedIndex: 0,
      });
    } else {
      this._openUrl(url);
    }
  }

  _openMediaViewer = ({ media, selectedIndex }) => {
    Keyboard.dismiss();

    interfaceHelper.showOverlay({
      name: 'MediaViewer',
      data: { media, selectedIndex },
    });
  }

  render() {
    const { message: { conversationUser, attachments, embeds, authUserConversationMessageReactions, conversationMessageReactions, createdAt }, heading, style } = this.props;
    const text = this._getText();
    const contentWidth = windowWidth - styles.content.marginLeft - styles.container.paddingHorizontal * 2;
    const parsedTextOptions = [
      {
        onPress: this._openUrl,
        pattern: /(https?:\/\/|www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*[-a-zA-Z0-9@:%_+~#?&/=])*/i,
        style: styles.messageLinkText,
      },
      {
        onPress: this._phonePress,
        type: 'phone',
        style: styles.messageLinkText,
      },
      {
        onPress: this._emailPress,
        type: 'email',
        style: styles.messageLinkText,
      },
    ];

    return (
      <Animated.View
        style={[
          styles.container,
          (heading) ? styles.containerWithHeading : null,
          style,
        ]}
      >
        {heading && (
          <BabbleUserAvatar
            avatarAttachment={conversationUser.user.avatarAttachment}
            lastActiveAt={conversationUser.user.lastActiveAt}
            size={40}
            onPress={() => this._userPress(conversationUser.userId)}
            style={styles.avatar}
          />
        )}

        <View style={styles.content}>
          {heading && (
            <View style={styles.heading}>
              <TouchableOpacity onPress={() => this._userPress(conversationUser.userId)}>
                <Text
                  dataDetectorType={'all'}
                  style={styles.nameText}
                >
                  {conversationUser.user.name}
                </Text>
              </TouchableOpacity>

              <Text style={styles.timeText}>{moment(createdAt).calendar()}</Text>
            </View>
          )}

          {!!text && (
            <ParsedText parse={parsedTextOptions} selectable style={styles.messageText}>
              {text}
            </ParsedText>
          )}

          {attachments?.length > 0 && (
            <View style={styles.attachments}>
              {attachments.map((attachment, index) => (
                <BabbleConversationMessageAttachment
                  attachment={attachment}
                  playVideoInline={attachments.length === 1}
                  onPress={() => this._openAttachment(index)}
                  maxWidth={contentWidth}
                  maxHeight={attachments.length === 1 ? 400 : 90}
                  style={[
                    styles.attachment,
                    (attachments.length > 1) ? styles.inlineAttachment : null,
                  ]}
                  key={index}
                />
              ))}
            </View>
          )}

          {embeds?.length > 0 && (
            <View style={styles.embeds}>
              {embeds.map((embed, index) => (
                <BabbleConversationMessageEmbed
                  embed={embed}
                  onPress={() => this._openEmbed(embed)}
                  maxWidth={contentWidth}
                  maxHeight={(embeds.length === 1) ? 200 : 75}
                  style={[
                    styles.embed,
                    (embeds.length > 1) ? styles.inlineEmbed : null,
                  ]}
                  key={index}
                />
              ))}
            </View>
          )}

          {conversationMessageReactions?.length > 0 && (
            <View style={styles.reactions}>
              {conversationMessageReactions.map((reaction, index) => (
                <BabbleReaction
                  onPress={() => this._reactionPress(reaction)}
                  reaction={reaction}
                  reacted={authUserConversationMessageReactions.some(conversationMessageReaction => (
                    conversationMessageReaction.reaction === reaction.reaction
                  ))}
                  count={reaction.count}
                  style={styles.reaction}
                  key={reaction.reaction}
                />
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  attachment: {
    marginBottom: 5,
  },
  attachments: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  avatar: {
    left: 15,
    position: 'absolute',
    top: 5,
  },
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: '100%',
  },
  containerWithHeading: {
    paddingTop: 8,
  },
  content: {
    flex: 1,
    marginLeft: 55,
  },
  embed: {
    marginBottom: 5,
  },
  embeds: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginTop: -4,
  },
  inlineAttachment: {
    marginRight: 5,
    width: undefined,
  },
  inlineEmbed: {
    marginRight: 5,
    width: undefined,
  },
  messageLinkText: {
    color: '#2A99CC',
  },
  messageText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  nameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
  reaction: {
    marginRight: 5,
    marginTop: 4,
  },
  reactions: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
  },
});
