import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleAutoscaleImage, BabbleAutoscaleVideo } from './';
import { VideoIcon, XIcon } from './icons';

export default class BabbleConversationMessageComposerToolbarAttachment extends Component {
  render() {
    const { attachment, onPress, onDeletePress, style } = this.props;

    return (
      <TouchableOpacity
        onPress={() => onPress()}
        style={style}
      >
        {attachment.mimetype.includes('image/') && (
          <BabbleAutoscaleImage
            minHeight={60}
            maxHeight={60}
            imageProps={{
              source: { uri: attachment.url },
              resizeMode: 'cover',
            }}
          />
        )}

        {attachment.mimetype.includes('video/') && (
          <>
            <BabbleAutoscaleVideo
              minHeight={60}
              maxHeight={60}
              videoProps={{
                paused: true,
                source: { uri: attachment.url },
                resizeMode: 'cover',
              }}
            />

            <VideoIcon
              width={15}
              height={15}
              style={styles.videoIcon}
            />
          </>
        )}

        <TouchableOpacity
          onPress={() => onDeletePress()}
          style={styles.deleteButton}
        >
          <XIcon
            width={14}
            height={14}
            style={styles.deleteButtonIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    top: 4,
    width: 18,
  },
  deleteButtonIcon: {
    color: '#FFFFFF',
  },
  videoIcon: {
    bottom: 4,
    color: '#FFFFFF',
    left: 4,
    position: 'absolute',
  },
});
