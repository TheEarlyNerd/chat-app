import React, { Component } from 'react';
import { KeyboardAvoidingView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BabbleFieldLabel, BabbleTextField, BabbleButton, BabbleTiledIconsBackground } from '../components';
import { LockIcon, CheckCircleIcon } from '../components/icons';

export default class PhoneLoginCodeScreen extends Component {
  render() {
    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={-30}
        style={styles.container}
      >
        <View style={styles.animationContainer}>
          <BabbleTiledIconsBackground
            iconComponents={[ LockIcon, CheckCircleIcon ]}
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
          <BabbleFieldLabel containerStyle={styles.codeFieldLabel}>Enter the code we texted you</BabbleFieldLabel>

          <View style={styles.codeContainer}>
            {Array(6).fill(null).map((value, index) => (
              <BabbleTextField
                placeholder={`${index + 1}`}
                maxLength={1}
                containerStyle={styles.codeTextField}
                style={styles.codeTextFieldInput}
                key={`code_${index}`}
              />
            ))}
          </View>

          <BabbleButton style={styles}>Continue</BabbleButton>

          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendButtonText}>Resend Code</Text>
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
  codeFieldLabel: {
    marginBottom: 8,
  },
  codeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  codeTextField: {
    width: 50,
  },
  codeTextFieldInput: {
    textAlign: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  resendButton: {
    marginTop: 10,
    padding: 10,
  },
  resendButtonText: {
    color: '#666666',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 18,
  },
});
