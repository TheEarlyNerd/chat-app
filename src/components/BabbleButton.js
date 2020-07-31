import React, { Component } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    zIndex: 1,
  },
  button: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonInverted: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  linearGradientBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    borderRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 18,
  },
  textInverted: {
    color: '#26A6C6',
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
