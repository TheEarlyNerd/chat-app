import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { BabbleAutoscaleImage, BabbleAutoscaleVideo } from './';

export default class BabbleRoomMessageAttachment extends Component {
  render() {
    const { attachment: { url, mimetype, width, height }, onPress, maxHeight, maxWidth, playVideoInline, style } = this.props;
    const isImage = mimetype.includes('image/');
    const isVideo = mimetype.includes('video/');

    return (
      <TouchableOpacity disabled={isVideo && playVideoInline} onPress={onPress} style={style}>
        {isImage && (
          <BabbleAutoscaleImage
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            sourceWidth={width}
            sourceHeight={height}
            loadingSize={'small'}
            imageProps={{
              source: { uri: url },
            }}
          />
        )}

        {isVideo && (
          <BabbleAutoscaleVideo
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            sourceWidth={width}
            sourceHeight={height}
            loadingSize={'small'}
            pointerEvents={!playVideoInline ? 'none' : 'auto'}
            videoProps={{
              paused: true,
              controls: true,
              source: { uri: url },
            }}
          />
        )}

        {!isImage && !isVideo && (
          <Text>FILE TODO</Text>
        )}
      </TouchableOpacity>
    );
  }
}
