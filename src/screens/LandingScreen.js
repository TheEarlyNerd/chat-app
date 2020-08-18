import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BabblePhoneField, BabbleButton, BabbleTiledIconsBackground } from '../components';
import { MessageSquareIcon, HeartIcon } from '../components/icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;

export default class LandingScreen extends Component {
  state = {
    phone: '',
    error: '',
    loading: false,
  }

  _submit = async () => {
    const { phone } = this.state;
    const validPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);

    if (!validPhone) {
      return this.setState({ error: 'Invalid phone number.' });
    }

    this.setState({ loading: true });

    try {
      await userManager.requestPhoneLoginCode(phone);
    } catch (error) {
      return this.setState({
        error: error.message,
        loading: false,
      });
    }

    this.props.navigation.navigate('PhoneLoginCode', { phone });
  }

  render() {
    const { error, loading } = this.state;

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
            onPhoneChange={phone => this.setState({ phone })}
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
  animationContainer: {
    alignItems: 'center',
    flex: 1,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backgroundImage: {
    aspectRatio: 1.0522,
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  continueButton: {
    marginBottom: 20,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoText: {
    color: '#FFFFFF',
    fontFamily: 'Lobster-Regular',
    fontSize: 60,
    letterSpacing: -3,
    marginTop: 60,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 2,
  },
  phoneFieldContainer: {
    marginBottom: 35,
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
