import React, { Component } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { BabbleAutoscaleImage } from './';

export default class BabbleConversationMessageEmbed extends Component {
  render() {
    const { title, description, url, audioUrl, imageUrl, videoUrl, maxWidth, maxHeight, style } = this.props;
    const isLink = (title || description) && url;

    return (
      <TouchableOpacity
        style={[
          styles.container,
          (isLink) ? styles.containerLink : null,
          style,
        ]}
      >
        {imageUrl && !videoUrl && !isLink && (
          <BabbleAutoscaleImage
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        )}

        {imageUrl && !videoUrl && isLink && (
          <Image
            source={{ uri: imageUrl }}
            resizeMode={'cover'}
            style={[ styles.image, styles.linkImage ]}
          />
        )}

        {audioUrl && !videoUrl && (
          <Text>TODO AUDIO PLAYBACK</Text>
        )}

        {videoUrl && (
          <Video
            paused
            source={{ uri: videoUrl }}
            controls
            style={styles.video}
          />
        )}

        {title && (
          <Text numberOfLines={2} style={styles.titleText}>{title}</Text>
        )}

        {description && (
          <Text numberOfLines={3} style={styles.descriptionText}>{description}</Text>
        )}

        {url && isLink && (
          <Text numberOfLines={1} style={styles.linkText}>{url}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  containerLink: {
    borderColor: '#D8D8D8',
    borderRadius: 4,
    borderWidth: 0.5,
    padding: 10,
  },
  descriptionText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
  },
  image: {
    borderRadius: 4,
  },
  linkImage: {
    height: 200,
    marginBottom: 5,
    width: '100%',
  },
  linkText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBoldItalic',
    fontSize: 12,
  },
  titleText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
  video: {
    borderRadius: 4,
    height: 200,
    width: '100%',
  },
});
