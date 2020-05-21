import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import moment from 'moment';
import ParsedText from 'react-native-parsed-text';
import { BabbleConversationMessageAttachment, BabbleConversationMessageEmbed, BabbleUserAvatar, BabbleReaction } from './';
import { SmileIcon, Trash2Icon, AlertTriangle, CopyIcon } from './icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { interfaceHelper, navigationHelper } = maestro.helpers;

export default class BabbleConversationMessage extends Component {
  _getText = () => {
    const { text, embeds } = this.props;
    const linklessText = embeds.reduce((linklessText, embed) => {
      return linklessText.replace(embed.url, '');
    }, text).trim();

    return (linklessText.length) ? text : '';
  }

  _messagePress = () => {
    const { user, text } = this.props;
    const actions = [
      {
        iconComponent: SmileIcon,
        text: 'Add Reaction',
        subtext: 'Show how you feel about this message by adding your reaction.',
      },
    ];

    if (text) {
      actions.push({
        iconComponent: CopyIcon,
        text: 'Copy Text',
      });
    }

    if (userManager.store.user.id === user.id) {
      actions.push({
        iconComponent: Trash2Icon,
        text: 'Delete Message',
        subtext: 'Permanently delete this message from the conversation.',
      });
    } else {
      actions.push({
        iconComponent: AlertTriangle,
        text: 'Report User',
        subtext: `Report ${user.name} for send innapropriate messages that may include hate, violence, nudity or something else.`,
      });
    }

    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: { actions },
    });
  }

  _userPress = userId => {
    navigationHelper.push('ProfileNavigator', {
      screen: 'Profile',
      params: { userId },
    });
  }

  _linkPress = url => {
    console.log(url);
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

  render() {
    const { user, attachments, embeds, reactions, createdAt, heading, style } = this.props;
    const text = this._getText();
    const parsedTextOptions = [
      {
        onPress: this._linkPress,
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
      <TouchableOpacity
        onLongPress={this._messagePress}
        deleyLongPress={500}
        style={[
          styles.container,
          (heading) ? styles.containerWithHeading : null,
          style,
        ]}
      >
        {heading && (
          <BabbleUserAvatar
            avatarAttachment={user.avatarAttachment}
            size={40}
            onPress={() => this._userPress(user.id)}
            style={styles.avatar}
          />
        )}

        <View style={styles.content}>
          {heading && (
            <View style={styles.heading}>
              <TouchableOpacity onPress={() => this._userPress(user.id)}>
                <Text
                  dataDetectorType={'all'}
                  style={styles.nameText}
                >
                  {user.name}
                </Text>
              </TouchableOpacity>

              <Text style={styles.timeText}>{moment(createdAt).calendar()}</Text>
            </View>
          )}

          {!!text && (
            <ParsedText parse={parsedTextOptions} style={styles.messageText}>
              {text}
            </ParsedText>
          )}

          {attachments?.length > 0 && (
            <View style={styles.attachments}>
              {attachments.map((attachment, index) => (
                <BabbleConversationMessageAttachment
                  maxWidth={335}
                  maxHeight={(attachments.length === 1) ? 200 : 75}
                  style={[
                    styles.attachment,
                    (attachments.length > 1) ? styles.inlineAttachment : null,
                  ]}
                  key={index}
                  {...attachment}
                />
              ))}
            </View>
          )}

          {embeds?.length > 0 && (
            <View style={styles.embeds}>
              {embeds.map((embed, index) => (
                <BabbleConversationMessageEmbed
                  maxWidth={335}
                  maxHeight={(embeds.length === 1) ? 200 : 75}
                  style={[
                    styles.embed,
                    (embeds.length > 1) ? styles.inlineEmbed : null,
                  ]}
                  key={index}
                  {...embed}
                />
              ))}
            </View>
          )}

          {reactions?.length > 0 && (
            <View style={styles.reactions}>
              {reactions.map((reaction, index) => (
                <BabbleReaction
                  reaction={reaction.reaction}
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
    top: 2,
  },
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 2,
    width: '100%',
  },
  containerWithHeading: {
    marginTop: 15,
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
