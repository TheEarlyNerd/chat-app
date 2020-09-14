import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { BabbleAutoscaleImage } from './';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class BabbleRoomMessageEmbed extends Component {
  state = {
    videoError: false,
  }

  _videoError = error => {
    console.log('video error', error);
    this.setState({ videoError: true });
  }

  render() {
    const { embed: { title, description, mimetype, url, audioUrl, imageUrl, videoUrl, width, height }, onPress, maxWidth, maxHeight, style } = this.props;
    const { videoError } = this.state;
    const isLink = !mimetype.includes('image/') && !mimetype.includes('video/') && url;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          (isLink) ? styles.containerLink : null,
          style,
        ]}
      >
        {imageUrl && !videoUrl && !isLink && (
          <BabbleAutoscaleImage
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            sourceWidth={width}
            sourceHeight={height}
            imageProps={{
              source: { uri: imageUrl },
            }}
            style={styles.image}
          />
        )}

        {imageUrl && (!videoUrl || videoError) && isLink && (
          <FastImage
            source={{ uri: imageUrl }}
            resizeMode={'cover'}
            style={[ styles.image, styles.linkImage ]}
          />
        )}

        {audioUrl && !videoUrl && (
          <Text>TODO AUDIO PLAYBACK</Text>
        )}

        {videoUrl && !videoError && (
          <Video
            paused
            source={{ uri: videoUrl }}
            controls
            onError={this._videoError}
            style={styles.video}
          />
        )}

        {title && isLink && (
          <Text numberOfLines={2} style={styles.titleText}>{title}</Text>
        )}

        {description && isLink && (
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
  containerLink: {
    borderColor: '#D8D8D8',
    borderRadius: 4,
    borderWidth: 0.5,
    maxWidth: 500,
    padding: 10,
  },
  descriptionText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 13, lg: 15 }),
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
    fontSize: interfaceHelper.deviceValue({ default: 11, lg: 13 }),
  },
  titleText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 17 }),
    marginTop: 5,
  },
  video: {
    borderRadius: 4,
    height: 200,
    width: '100%',
  },
});
