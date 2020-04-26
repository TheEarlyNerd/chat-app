import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BabbleUserAvatar } from './';
import { EyeIcon, UserIcon, MessageCircleIcon } from './icons';

export default class BabbleConversationPreviewMessage extends Component {
  render() {
    const { name, message, avatarUri, style } = this.props;

    return (
      <TouchableOpacity style={[ styles.container, style ]}>
        <BabbleUserAvatar
          source={{ uri: avatarUri }}
          size={50}
        />

        <View style={styles.content}>
          <View style={styles.spacedRow}>
            <Text style={styles.nameText}>{name}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {this.props.conversation && (
                <View style={styles.stats}>
                  <View style={styles.stat}>
                    <UserIcon width={17} height={17} style={[ styles.statIcon, styles.liveColor ]} />
                    <Text style={[ styles.statText, styles.liveColor ]}>{Math.floor(Math.random() * 50)}</Text>
                  </View>

                  <View style={styles.stat}>
                    <EyeIcon width={17} height={17} style={styles.statIcon} />
                    <Text style={styles.statText}>{Math.floor(Math.random() * 800) + 100}</Text>
                  </View>
                </View>
              )}

              {this.props.unread && (
                <View style={styles.unreadBubble}>
                  <Text style={styles.unreadText}>{this.props.unread}</Text>

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
            <View style={{ flex: 1 }}>
              <Text numberOfLines={3} style={[ styles.previewText, (this.props.unread) ? styles.unreadColor : null ]}>{message}</Text>

              {!this.props.conversation && (
                <Text style={styles.timeText}>10:24 PM</Text>
              )}
            </View>

            {this.props.media && (
              <Image
                source={{ uri: 'https://cdn.dribbble.com/users/25514/screenshots/11009722/dribbble__5__teaser.png' }}
                style={styles.mediaImage}
              />
            )}
          </View>

          {this.props.conversation && (
            <View style={styles.spacedRow}>
              <View style={styles.reactions}>
                <View style={styles.reaction}>
                  <Text style={styles.reactionText}>🐻🐻🐻</Text>
                  <Text style={styles.reactionCountText}>9</Text>
                </View>

                <View style={styles.reaction}>
                  <Text style={styles.reactionText}>LOL</Text>
                  <Text style={styles.reactionCountText}>6</Text>
                </View>

                <View style={styles.reaction}>
                  <Text style={styles.reactionText}>🍔</Text>
                  <Text style={styles.reactionCountText}>2</Text>
                </View>

                <View style={styles.reaction}>
                  <Text style={styles.reactionText}>🥰🥰</Text>
                  <Text style={styles.reactionCountText}>6</Text>
                </View>
              </View>
            </View>
          )}

          {this.props.conversation && (
            <Text style={styles.tickerText} numberOfLines={1}>
              <MessageCircleIcon style={styles.tickerIcon} width={14} height={14} />
              <Text style={styles.tickerNameText}>Jack Rex: </Text>
              yah this makes a lot of sense I guess but w/e bro
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: 15,
    paddingTop: 4,
  },
  spacedRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
  timeText: {
    color: '#97A1A4',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    marginTop: 4,
  },
  preview: {
    flexDirection: 'row',
    marginTop: 4,
  },
  previewText: {
    flex: 1,
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  unreadBubble: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    marginLeft: 10,
    borderRadius: 10,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  unreadBubbleBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    zIndex: -1,
  },
  unreadText: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stats: {
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
  statText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
  },
  liveColor: {
    color: '#FF4444',
  },
  unreadColor: {
    color: '#404040',
  },

  reaction: {
    marginTop: 8,
    backgroundColor: '#F1F2F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    paddingBottom: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  reactionText: {
    color: '#000000',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    lineHeight: 17,
  },
  reactionCountText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
    marginLeft: 3,
  },
  tickerIcon: {
    color: '#2A99CC',
    marginBottom: -1,
    marginRight: 5,
  },
  tickerNameText: {
    color: '#2A99CC',
  },
  tickerText: {
    flex: 1,
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBoldItalic',
    fontSize: 12,
    marginTop: 10,
  },


  mediaImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginTop: 4,
    marginLeft: 10,
    alignSelf: 'flex-start',
  }
});
