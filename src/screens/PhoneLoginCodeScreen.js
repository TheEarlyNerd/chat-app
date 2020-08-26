import React, { Component } from 'react';
import { KeyboardAvoidingView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BabbleCodeField, BabbleButton, BabbleBackground } from '../components';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { navigationHelper } = maestro.helpers;

export default class PhoneLoginCodeScreen extends Component {
  state = {
    sendingText: true,
    loading: true,
    error: null,
  }

  codeTextField = null;
  loginCodeDelayTimeout = null;

  componentDidMount() {
    this.codeTextField.focus();

    this.loginCodeDelayTimeout = setTimeout(() => this.setState({
      sendingText: false,
      loading: false,
    }), 5500);
  }

  componentWillUnmount() {
    clearTimeout(this.loginCodeDelayTimeout);
  }

  _submit = async () => {
    const { phone } = this.props.route.params;
    const phoneLoginCode = this.codeTextField.value;

    if (phoneLoginCode.length < 6) {
      return this.setState({ error: 'Invalid login code.' });
    }

    this.setState({ loading: true });

    try {
      await userManager.login({ phone, phoneLoginCode });
    } catch (error) {
      return this.setState({
        error: error.message,
        loading: false,
      });
    }

    navigationHelper.reset(userManager.nextRouteNameForUserState());
  }

  render() {
    const { sendingText, loading, error } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={-40}
        style={styles.container}
      >
        <View style={styles.animationContainer}>
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
            source={require('../assets/images/loginCodeBackground.png')}
            style={styles.backgroundImage}
          />
        </View>

        <View style={styles.formContainer}>
          <BabbleCodeField
            label={(sendingText) ? "We're texting you your login code..." : 'Enter the code we texted you'}
            codeLength={6}
            error={error}
            ref={component => this.codeTextField = component}
          />

          <BabbleButton
            onPress={this._submit}
            loading={loading}
            style={styles.continueButton}
          >
            Continue
          </BabbleButton>

          {!sendingText && (
            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
          )}
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
    aspectRatio: 1.6332,
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  continueButton: {
    marginTop: 35,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
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
