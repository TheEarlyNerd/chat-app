import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { BabbleAutoscaleView } from './';

export default class BabbleAutoscaleVideo extends Component {
  autoscaleView = null;

  componentDidMount() {
    const { sourceWidth, sourceHeight } = this.props;

    if (sourceWidth && sourceHeight) {
      return this.autoscaleView.adjustSize(sourceWidth, sourceHeight);
    }
  }

  _onLoad = ({ naturalSize }) => {
    const { sourceWidth, sourceHeight } = this.props;
    const { width, height } = naturalSize;

    if (!sourceWidth && !sourceHeight) {
      this.autoscaleView.adjustSize(width, height);
    }
  }

  render() {
    const { videoProps, style, ...props } = this.props;

    return (
      <BabbleAutoscaleView
        ref={component => this.autoscaleView = component}
        {...props}
      >
        <Video
          {...videoProps}
          onLoad={this._onLoad}
          style={[ styles.video, style ]}
        />
      </BabbleAutoscaleView>
    );
  }
}

const styles = StyleSheet.create({
  video: {
    height: '100%',
    width: '100%',
  },
});
