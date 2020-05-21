import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { BabbleAutoscaleImage } from './';

export default class BabbleConversationMessageAttachment extends Component {
  render() {
    const { filename, bytes, url, mimetype, maxHeight, maxWidth, style } = this.props;
    const isImage = mimetype.includes('image/');
    const isVideo = mimetype.includes('video/');

    return (
      <TouchableOpacity style={style}>
        {isImage && (
          <BabbleAutoscaleImage
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            source={{ uri: url }}
            style={styles.image}
          />
        )}

        {isVideo && (
          <Video
            paused
            source={{ uri: url }}
            controls
            style={styles.video}
          />
        )}

        {!isImage && !isVideo && (
          <Text>FILE TODO</Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 4,
  },
  video: {
    borderRadius: 4,
    height: 200,
    width: '100%',
  }
});
