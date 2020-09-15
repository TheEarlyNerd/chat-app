import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class BabbleBackground extends PureComponent {
  render() {
    const { linearGradientProps, linearGradientRotationAngle, bottom, style } = this.props;

    return (
      <View
        style={[
          styles.container,
          (bottom) ? styles.containerBottom : null,
          style,
        ]}
      >
        {linearGradientProps && (
          <LinearGradient
            {...linearGradientProps}
            style={[
              (linearGradientRotationAngle) ? { transform: [ { rotate: `${linearGradientRotationAngle}deg` } ] } : null,
              styles.linearGradient,
              (bottom) ? styles.linearGradientBottom : null,
            ]}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  containerBottom: {
    shadowOffset: { width: 0, height: -3 },
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
    top: -100,
    zIndex: -1,
  },
  linearGradientBottom: {
    bottom: -100,
    top: 0,
  },
});
