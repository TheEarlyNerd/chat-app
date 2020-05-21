import React, { Component } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

export default class BabbleAutoscaleImage extends Component {
  state = {
    adjustedWidth: 0,
    adjustedHeight: 0,
    loading: true,
  }

  componentDidMount() {
    const { source } = this.props;

    if (source.uri) {
      Image.getSize(
        source.uri,
        (width, height) => this._adjustSize(width, height),
        console.err,
      );
    } else {
      const resolvedSource = Image.resolveAssetSource(source);

      this._adjustSize(resolvedSource.width, resolvedSource.height);
    }
  }

  _adjustSize = (sourceWidth, sourceHeight) => {
    const { minWidth, minHeight, maxWidth, maxHeight } = this.props;
    let adjustedWidth = minWidth || sourceWidth;
    let adjustedHeight = minHeight || sourceHeight;
    let aspectRatio = 0;

    if (sourceWidth > maxWidth) {
      aspectRatio = maxWidth / sourceWidth;
      adjustedWidth = maxWidth;
      adjustedHeight = sourceHeight * aspectRatio;
      sourceWidth *= aspectRatio;
      sourceHeight *= aspectRatio;
    }

    if (sourceHeight > maxHeight) {
      aspectRatio = maxHeight / sourceHeight;
      adjustedWidth = sourceWidth * aspectRatio;
      adjustedHeight = maxHeight;
    }

    this.setState({ adjustedWidth, adjustedHeight });
  }

  render() {
    const { style, containerStyle, ...props } = this.props;
    const { adjustedWidth, adjustedHeight, loading } = this.state;

    return (
      <View
        style={[
          {
            width: adjustedWidth,
            height: adjustedHeight,
          },
          containerStyle,
        ]}
      >
        {((!!adjustedWidth && !!adjustedHeight) || loading) && (
          <ActivityIndicator
            size={'large'}
            color={'#404040'}
            style={styles.activityIndicator}
          />
        )}

        <FastImage
          style={[ styles.image, style ]}
          onLoadEnd={() => this.setState({ loading: false })}
          {...props}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
