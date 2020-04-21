import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BabblePhoneField, BabbleButton, BabbleTiledIconsBackground } from '../components';
import { MessageSquareIcon, HeartIcon } from '../components/icons';
import maestro from '../maestro';

export default class LandingScreen extends Component {
  state = {
    phone: '',
    phoneError: '',
    loading: false,
  }

  _login = () => {
    const { phone } = this.state;
    const validPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);

    if (!validPhone) {
      return this.setState({ phoneError: 'Invalid phone number.' });
    }

    // send codes
  }

  render() {
    const { phoneError, loading } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={-85}
        style={styles.container}
      >
        <View style={styles.animationContainer}>
          <Text style={styles.logoText}>Babble</Text>

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
          <BabblePhoneField containerStyle={styles.phoneFieldContainer} />

          <BabbleButton
            onPress={this._login}
            loading={loading}
            style={styles.continueButton}
          >
            Continue
          </BabbleButton>

          {/* we should have a skip or explain button for skeptical users, phone is a big ask? */}

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
  phoneFieldContainer: {
    marginBottom: 35,
  },
  logoText: {
    color: '#FFFFFF',
    fontFamily: 'Lobster-Regular',
    fontSize: 60,
    marginTop: 60,
    letterSpacing: -3,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
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
