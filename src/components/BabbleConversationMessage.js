import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { BabbleConversationMessageAttachment, BabbleConversationMessageEmbed, BabbleUserAvatar, BabbleReaction } from './';

export default class BabbleConversationMessage extends Component {
  render() {
    const { user, text, attachments, embeds, reactions, createdAt, heading, style } = this.props;

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
            source={{ uri: user.avatarAttachment.url }}
            size={40}
            style={styles.avatar}
          />
        )}

        <View style={styles.content}>
          {heading && (
            <View style={styles.heading}>
              <TouchableOpacity>
                <Text style={styles.nameText}>{user.name}</Text>
              </TouchableOpacity>

              <Text style={styles.timeText}>{moment(createdAt).calendar()}</Text>
            </View>
          )}

          {text && (
            <Text style={styles.messageText}>{text}</Text>
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
