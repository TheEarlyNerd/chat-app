import React, { Component } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import { BabbleTiledIconsBackground } from './';
import { AlertTriangleIcon, FrownIcon } from './icons';
import maestro from '../maestro';

export default class BabbleOverlayError extends Component {
  state = {
    containerTranslateYAnimated: new Animated.Value(-250),
  }

  componentDidMount() {
    const { containerTranslateYAnimated } = this.state;

    Animated.sequence([
      Animated.spring(containerTranslateYAnimated, {
        toValue: 0,
        speed: 5,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.timing(containerTranslateYAnimated, {
        toValue: -250,
        duration: 500,
        useNativeDriver: true,
        delay: 4000,
      }),
    ]).start(() => {
      maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'Error' });
    });
  }

  render() {
    const { message, iconComponent } = this.props.data;
    const { containerTranslateYAnimated } = this.state;
    const Icon = iconComponent || FrownIcon;

    return (
      <Animated.View style={[ styles.container, { transform: [ { translateY: containerTranslateYAnimated } ] } ]}>
        <Icon
          width={25}
          height={25}
          style={styles.errorIcon}
        />

        <Text style={styles.errorText}>{message}</Text>

        <BabbleTiledIconsBackground
          iconComponents={[ AlertTriangleIcon ]}
          iconSize={20}
          iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
          iconSpacing={20}
          linearGradientProps={{
            colors: [ '#EA5446', '#F54444' ],
            locations: [ 0, 0.7 ],
            useAngle: true,
            angle: 36,
          }}
          style={styles.backgroundGradient}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    minHeight: 100,
    zIndex: 2,
    flexDirection: 'row',
    paddingTop: 56,
    paddingBottom: 20,
  },
  errorIcon: {
    color: '#FFFFFF',
    marginLeft: 15,
  },
  errorText: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 18,
    paddingHorizontal: 10,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
