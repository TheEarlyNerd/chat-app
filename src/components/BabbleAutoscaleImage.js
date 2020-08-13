import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BabbleAutoscaleView } from './';

export default class BabbleAutoscaleImage extends Component {
  autoscaleView = null;

  componentDidMount() {
    const { sourceWidth, sourceHeight, imageProps } = this.props;

    if (sourceWidth && sourceHeight) {
      return this.autoscaleView.adjustSize(sourceWidth, sourceHeight);
    }

    if (imageProps.source.uri) {
      return Image.getSize(
        imageProps.source.uri,
        (width, height) => this.autoscaleView.adjustSize(width, height),
        console.err,
      );
    }

    const resolvedSource = Image.resolveAssetSource(imageProps.source);

    this.autoscaleView.adjustSize(resolvedSource.width, resolvedSource.height);
  }

  render() {
    const { imageProps, style, ...props } = this.props;

    return (
      <BabbleAutoscaleView
        ref={component => this.autoscaleView = component}
        {...props}
      >
        <FastImage
          {...imageProps}
          style={[ styles.image, style ]}
        />
      </BabbleAutoscaleView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});
