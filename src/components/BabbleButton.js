import React, { Component } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class BabbleButton extends Component {
  render() {
    const { children, onPress, inverted, loading, disabled, style, textStyle } = this.props;

    return (
      <TouchableOpacity
        disabled={loading || disabled}
        onPress={onPress}
        style={[
          styles.button,
          (inverted) ? styles.buttonInverted : null,
          (disabled) ? styles.buttonDisabled : null,
          style,
        ]}
      >
        <View style={styles.container}>
          {!inverted && (
            <LinearGradient
              useAngle
              angle={36}
              colors={[ '#299BCB', '#1ACCB4' ]}
              style={styles.linearGradientBackground}
            />
          )}

          {loading && (
            <ActivityIndicator size={'small'} color={'#FFFFFF'} />
          )}

          {!loading && (
            <Text
              style={[
                styles.text,
                (inverted) ? styles.textInverted : null,
                textStyle,
              ]}
            >
              {children}
            </Text>
          )}
        </View>

        <View style={styles.shadow} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: interfaceHelper.deviceValue({ default: 44, lg: 50 }),
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonInverted: {
    backgroundColor: '#FFFFFF',
    borderColor: '#26A6C6',
    borderRadius: 4,
    borderWidth: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    justifyContent: 'center',
    zIndex: 1,
  },

  linearGradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
    zIndex: -1,
  },
  shadow: {
    backgroundColor: '#FFF',
    bottom: 0,
    left: '5%',
    position: 'absolute',
    right: '5%',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    top: 10,
    zIndex: -2,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 18, lg: 22 }),
  },
  textInverted: {
    color: '#26A6C6',
  },
});
