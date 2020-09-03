import React, { Component } from 'react';
import { KeyboardAvoidingView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BabbleCodeField, BabbleButton, BabbleBackground } from '../components';
import { ArrowLeftIcon } from '../components/icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { navigationHelper, dataHelper, interfaceHelper } = maestro.helpers;

export default class PhoneLoginCodeScreen extends Component {
  state = {
    sendingText: true,
    resendingText: false,
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

  _resend = async () => {
    const { phone } = this.props.route.params;

    this.setState({ resendingText: true });

    await userManager.requestPhoneLoginCode(phone);

    setTimeout(() => {
      this.setState({ resendingText: false });
    }, 5500); // give time for text to arrive.
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
    const { countryCode, phone } = this.props.route.params;
    const { sendingText, resendingText, loading, error } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={interfaceHelper.deviceValue({ xs: -7, default: -30 })}
        style={styles.container}
      >
        <TouchableOpacity onPress={() => navigationHelper.pop()} style={styles.backButton}>
          <ArrowLeftIcon
            width={33}
            height={33}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.topContainer}>
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
            <TouchableOpacity
              onPress={this._resend}
              disabled={resendingText}
              style={styles.resendButton}
            >
              <Text style={styles.resendButtonText}>{resendingText ? `Resending code to +${dataHelper.formatPhoneNumber(countryCode, phone)}...` : 'Resend Code'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    left: 15,
    position: 'absolute',
    top: interfaceHelper.deviceValue({ default: 30, notchAdjustment: 20 }),
    zIndex: 1,
  },
  backIcon: {
    color: '#FFFFFF',
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
    flexDirection: interfaceHelper.deviceValue({ default: 'column', lg: 'row' }),
  },
  continueButton: {
    marginTop: 35,
  },
  formContainer: {
    alignItems: 'center',
    flex: interfaceHelper.deviceValue({ default: 1, xs: 1.4, lg: 1 }),
    justifyContent: 'center',
    paddingHorizontal: interfaceHelper.deviceValue({ default: 30, lg: 60 }),
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
  topContainer: {
    alignItems: 'center',
    flex: interfaceHelper.deviceValue({ default: 1, lg: 1.618 }),
  },
});
