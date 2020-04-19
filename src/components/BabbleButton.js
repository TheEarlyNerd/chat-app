import React, { Component } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class BabbleButton extends Component {
  render() {
    const { children, loading, disabled, style } = this.props;

    return (
      <TouchableOpacity
        disabled={loading || disabled}
        style={[
          styles.button,
          style,
        ]}
      >
        <LinearGradient
          useAngle
          angle={36}
          colors={[ '#299BCB', '#1ACCB4' ]}
          style={styles.linearGradientBackground}
        />

        {loading && (
          <ActivityIndicator size={'small'} color={'#FFFFFF'} />
        )}

        {!loading && (
          <Text style={styles.text}>{children}</Text>
        )}

        <View style={styles.shadow} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradientBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    borderRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 19,
  },
  shadow: {
    position: 'absolute',
    top: 10,
    bottom: 0,
    left: '5%',
    right: '5%',
    zIndex: -2,
    backgroundColor: '#FFF',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});
