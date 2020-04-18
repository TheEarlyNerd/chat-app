import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class LandingScreen extends Component {
  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.animationContainer}>
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            colors={[ '#5DD9DE', '#39C9CE' ]}
            style={styles.backgroundGradient}
          />
        </View>

        <View style={styles.formContainer}>

        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: -100,
    right: -100,
    bottom: 0,
    left: -100,
    zIndex: -1,
    backgroundColor: '#5DD9DE',
    transform: [ { rotate: '-9deg' } ],

  },
});
