import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BabbleUserAvatar, BabbleReaction } from './';
import { EyeIcon, UserIcon, MessageCircleIcon } from './icons';

export default class BabbleConversationPreview extends Component {
  render() {
    const { conversation, style } = this.props;
    const { accessLevel, previewConversationMessage, user } = conversation;
    const { attachments, embeds, conversationMessageReactions, tempUnread, tempImage } = previewConversationMessage;

    return (
      <TouchableOpacity style={[ styles.container, style ]}>
        <BabbleUserAvatar
          source={{ uri: user.avatarAttachment.url }}
          size={50}
        />

        <View style={styles.content}>
          <View style={styles.metadata}>
            <TouchableOpacity>
              <Text style={styles.nameText}>{user.name}</Text>
            </TouchableOpacity>

            <View style={styles.stats}>
              {accessLevel !== 'private' && (
                <>
                  <View style={styles.stat}>
                    <UserIcon width={17} height={17} style={[ styles.statIcon, styles.statLiveColor ]} />
                    <Text style={[ styles.statText, styles.statLiveColor ]}>12</Text>
                  </View>

                  <View style={styles.stat}>
                    <EyeIcon width={17} height={17} style={styles.statIcon} />
                    <Text style={styles.statText}>123</Text>
                  </View>
                </>
              )}

              {tempUnread && (
                <View style={styles.unreadBubble}>
                  <Text style={styles.unreadCountText}>12</Text>

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
              <Text numberOfLines={3} style={[ styles.previewText, (tempUnread) ? styles.previewUnreadColor : null ]}>{previewConversationMessage.text}</Text>
              <Text style={styles.timeText}>10:24 PM</Text>
            </View>

            {tempImage && (
              <View style={styles.previewImages}>
                <Image
                  source={{ uri: tempImage }}
                  style={styles.previewImage}
                />
              </View>
            )}
          </View>

          {!!conversationMessageReactions.length && (
            <View style={styles.reactions}>
              {conversationMessageReactions.map((conversationMessageReaction, index) => (
                <BabbleReaction
                  reaction={conversationMessageReaction.reaction}
                  count={conversationMessageReaction.count}
                  style={styles.reaction}
                  key={`${conversation.id}_reaction_${index}`}
                />
              ))}
            </View>
          )}

          {accessLevel !== 'private' && (
            <View style={styles.chatGlance}>
              <MessageCircleIcon style={styles.chatGlanceIcon} width={14} height={14} />
              <Text style={styles.chatGlanceNameText}>Jack Rex: </Text>
              <Text style={styles.chatGlanceText}>This is a test bro...</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  chatGlance: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chatGlanceIcon: {
    color: '#2A99CC',
  },
  chatGlanceNameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBoldItalic',
    fontSize: 12,
  },
  chatGlanceText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBoldItalic',
    fontSize: 12,
  },
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginLeft: 15,
    paddingTop: 4,
  },
  metadata: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
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
  previewImages: {

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
  reaction: {
    marginRight: 10,
    marginTop: 8,
  },
  reactions: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
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
    fontFamily: 'NunitoSans-Bold',
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
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
  },
});
