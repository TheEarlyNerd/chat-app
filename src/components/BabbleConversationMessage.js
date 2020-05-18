import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import ParsedText from 'react-native-parsed-text';
import { BabbleConversationMessageAttachment, BabbleConversationMessageEmbed, BabbleUserAvatar, BabbleReaction } from './';
import maestro from '../maestro';

const { navigationHelper } = maestro.helpers;

export default class BabbleConversationMessage extends Component {
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
    console.log(phone);
  }

  emailPress = email => {
    console.log(email);
  }

  render() {
    const { user, text, attachments, embeds, reactions, createdAt, heading, style } = this.props;
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

          {text && (
            <ParsedText parse={parsedTextOptions} style={styles.messageText}>
              {text}
            </ParsedText>
          )}

          {!!attachments && attachments.length > 0 && (
            <View style={styles.attachments}>
              {attachments.map(attachment => (
                <BabbleConversationMessageAttachment
                  key={attachment.id}
                  {...attachment}
                />
              ))}
            </View>
          )}

          {!!embeds && embeds.length > 0 && (
            <View style={styles.embeds}>
              {embeds.map(embed => (
                <BabbleConversationMessageEmbed
                  maxWidth={335}
                  maxHeight={(embeds.length === 1) ? 200 : 75}
                  style={[
                    styles.embed,
                    (embeds.length > 1) ? styles.inlineEmbed : null,
                  ]}
                  key={embed.id}
                  {...embed}
                />
              ))}
            </View>
          )}

          {!!reactions && reactions.length > 0 && (
            <View style={styles.reactions}>
              {reactions.map(reaction => (
                <BabbleReaction
                  reaction={reaction.reaction}
                  count={reaction.count}
                  style={styles.reaction}
                  key={reaction.id}
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
