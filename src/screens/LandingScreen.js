import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BabbleTextField, BabbleButton, BabbleTiledIconsBackground } from '../components';
import { MessageSquareIcon, HeartIcon } from '../components/icons';

export default class LandingScreen extends Component {
  render() {
    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={-90}
        style={styles.container}
      >
        <View style={styles.animationContainer}>
          <BabbleTiledIconsBackground
            iconComponents={[ MessageSquareIcon, HeartIcon ]}
            iconSize={20}
            iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
            iconSpacing={37}
            linearGradientRotationAngle={-9}
            linearGradientProps={{
              colors: [ '#299BCB', '#1ACCB4' ],
              locations: [ 0, 0.7 ],
              useAngle: true,
              angle: 36,
            }}
            style={styles.backgroundGradient}
          />
        </View>

        <View style={styles.formContainer}>
          <BabbleTextField
            placeholder={'(201) 867-5309'}
            returnKeyType={'done'}
            keyboardType={'phone-pad'}
            containerStyle={styles.textFieldContainer}
          />

          <BabbleButton style={styles.continueButton}>Continue</BabbleButton>

          <TouchableOpacity>
            <Text style={styles.termsButtonText}>By continuing, I confirm that I am at least 18 years old and I agree to Babble's <Text style={styles.termsButtonTextBold}>Terms of Service</Text> and <Text style={styles.termsButtonTextBold}>Privacy Policy</Text>.</Text>
          </TouchableOpacity>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  textFieldContainer: {
    marginBottom: 30,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  continueButton: {
    marginBottom: 20,
  },
  termsButtonText: {
    color: '#9B9B9B',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  termsButtonTextBold: {
    fontFamily: 'NunitoSans-Bold',
  },
});
