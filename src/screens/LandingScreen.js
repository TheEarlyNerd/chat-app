import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BabblePhoneField, BabbleButton, BabbleBackground } from '../components';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;
const { userManager } = maestro.managers;

export default class LandingScreen extends Component {
  state = {
    countryCode: '',
    phone: '',
    error: '',
    loading: false,
  }

  _submit = async () => {
    const { countryCode, phone } = this.state;
    const validPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);

    if (!validPhone) {
      return this.setState({ error: 'Invalid phone number.' });
    }

    this.setState({ loading: true });

    try {
      await userManager.requestPhoneLoginCode(phone);

      // visually pleasing, continue doesn't flash on screen transition.
      setTimeout(() => this.setState({ loading: false }), 1000);
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }

    this.props.navigation.navigate('PhoneLoginCode', { countryCode, phone });
  }

  render() {
    const { error, loading } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={interfaceHelper.deviceValue({ xs: -50, default: -85 })}
        style={styles.container}
      >
        <View style={styles.topContainer}>
          <Text style={styles.logoText}>Babble</Text>

          <BabbleBackground
            linearGradientProps={{
              colors: [ '#299BCB', '#1ACCB4' ],
              locations: [ 0, 0.7 ],
              useAngle: true,
              angle: 36,
            }}
            style={styles.backgroundGradient}
          />

          <FastImage
            resizeMode={'contain'}
            source={require('../assets/images/landingBackground.png')}
            style={styles.backgroundImage}
          />
        </View>

        <View style={styles.formContainer}>
          <BabblePhoneField
            onPhoneChange={(countryCode, phone) => this.setState({ countryCode, phone })}
            containerStyle={styles.phoneFieldContainer}
            error={error}
          />

          <BabbleButton
            onPress={this._submit}
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
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backgroundImage: {
    aspectRatio: 1.0522,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: -1,
  },
  container: {
    flex: 1,
    flexDirection: interfaceHelper.deviceValue({ default: 'column', lg: 'row' }),
  },
  continueButton: {
    marginBottom: 20,
  },
  formContainer: {
    alignItems: 'center',
    flex: interfaceHelper.deviceValue({ default: 1, xs: 1.15, lg: 1 }),
    justifyContent: 'center',
    paddingHorizontal: interfaceHelper.deviceValue({ default: 30, lg: 60 }),
  },
  logoText: {
    color: '#FFFFFF',
    fontFamily: 'Lobster-Regular',
    fontSize: interfaceHelper.deviceValue({ default: 60, lg: 90 }),
    letterSpacing: -3,
    marginTop: interfaceHelper.deviceValue({ default: 60, lg: 60 }),
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 2,
  },
  phoneFieldContainer: {
    marginBottom: 25,
  },
  termsButtonText: {
    color: '#9B9B9B',
    fontFamily: 'NunitoSans-Regular',
    fontSize: interfaceHelper.deviceValue({ default: 12, lg: 14 }),
    textAlign: 'center',
  },
  termsButtonTextBold: {
    fontFamily: 'NunitoSans-Bold',
  },
  topContainer: {
    alignItems: 'center',
    backgroundColor: '#fF0000',
    flex: interfaceHelper.deviceValue({ default: 1, lg: 1.618 }),
  },
});
