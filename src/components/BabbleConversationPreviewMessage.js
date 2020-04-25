import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleUserAvatar } from './';
import { EyeIcon, UserIcon } from './icons';

export default class BabbleConversationPreviewMessage extends Component {
  render() {
    const { style } = this.props;

    return (
      <TouchableOpacity style={[ styles.container, style ]}>
        <BabbleUserAvatar
          source={{ uri: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.upp-prod-us.s3.amazonaws.com%2F1e8db4c2-99c1-11e9-9573-ee5cbb98ed36?fit=scale-down&source=next&width=700' }}
          size={50}
        />

        <View style={styles.content}>
          <View style={styles.spacedRow}>
            <Text style={styles.nameText}>CryptoTalk</Text>

            {!this.props.conversation && (
              <Text style={styles.timeText}>10:24 PM</Text>
            )}

            {this.props.conversation && (
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <UserIcon width={17} height={17} style={[ styles.statIcon, styles.liveColor ]} />
                  <Text style={[ styles.statText, styles.liveColor ]}>0</Text>
                </View>

                <View style={styles.stat}>
                  <EyeIcon width={17} height={17} style={styles.statIcon} />
                  <Text style={styles.statText}>1,252</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.preview}>
            <Text numberOfLines={(this.props.conversation) ? 3 : 1} style={styles.previewText}>Chat about your crypto investments and how we all lose money</Text>
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
              </View>
            </View>
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
    justifyContent: 'space-between',
  },
  nameText: {
    color: '#26A6C6',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
  timeText: {
    color: '#97A1A4',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    marginTop: 2,
  },
  preview: {

  },
  previewText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
    marginBottom: 3,
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
    color: '#97A1A4',
    marginRight: 3,
  },
  statText: {
    color: '#97A1A4',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
  },
  liveColor: {
    color: '#FF4444',
  },

  reaction: {
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

});
