import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class LandingScreen extends Component {
  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.animationContainer}>
          <Text style={styles.logoText}>Babble</Text>

          <LinearGradient
            colors={[ '#1ACCB4', '#299BCB' ]}
            style={styles.landingBackground}
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
    flex: 2,
    alignItems: 'center',
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  landingBackground: {
    position: 'absolute',
    top: -100,
    right: -100,
    bottom: 0,
    left: -100,
    zIndex: -1,
    backgroundColor: '#5DD9DE',
    transform: [ { rotate: '-9deg' } ],

  },


  logoText: {
    color: '#FFFFFF',
    marginTop: 70,
    fontFamily: 'NunitoSans-Black',
    fontSize: 42,
  },
});
