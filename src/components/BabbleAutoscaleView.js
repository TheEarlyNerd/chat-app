import React, { PureComponent } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default class BabbleAutoscaleView extends PureComponent {
  state = {
    adjustedWidth: 0,
    adjustedHeight: 0,
  }

  adjustSize = (sourceWidth, sourceHeight) => {
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
    const { children, loadingSize, loadingColor, pointerEvents, containerStyle } = this.props;
    const { adjustedWidth, adjustedHeight } = this.state;

    return (
      <View
        pointerEvents={pointerEvents}
        style={[
          {
            width: adjustedWidth,
            height: adjustedHeight,
          },
          styles.container,
          containerStyle,
        ]}
      >
        <ActivityIndicator
          size={loadingSize || 'large'}
          color={loadingColor || '#404040'}
          style={styles.activityIndicator}
        />

        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    backgroundColor: '#D8D8D8',
    borderRadius: 4,
    overflow: 'hidden',
  },
});
