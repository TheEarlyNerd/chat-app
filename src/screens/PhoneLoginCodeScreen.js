import React, { Component } from 'react';
import { KeyboardAvoidingView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BabbleFieldLabel, BabbleTextField, BabbleButton, BabbleTiledIconsBackground } from '../components';
import { LockIcon, CheckCircleIcon } from '../components/icons';

export default class PhoneLoginCodeScreen extends Component {
  state = {
    focusedCodeTextFieldIndex: 0,
    sendingText: true,
    loading: true,
    error: null,
  }

  codeTextFields = [];
  loginCodeDelayTimeout = null;

  componentDidMount() {
    this.codeTextFields[0].focus();

    this.loginCodeDelayTimeout = setTimeout(() => this.setState({
      sendingText: false,
      loading: false,
    }), 5500);
  }

  componentWillUnmount() {
    clearTimeout(this.loginCodeDelayTimeout);
  }

  _onKeyPress = ({ nativeEvent }) => {
    const { key } = nativeEvent;
    const { focusedCodeTextFieldIndex } = this.state;
    const currentCodeTextField = this.codeTextFields[focusedCodeTextFieldIndex];
    const indexShift = (key !== 'Backspace') ? 1 : -1;

    if (indexShift === 1) {
      if (focusedCodeTextFieldIndex >= this.codeTextFields.length - 1) {
        return;
      }

      if (currentCodeTextField.value && !this.codeTextFields[focusedCodeTextFieldIndex + indexShift].value) {
        this.codeTextFields[focusedCodeTextFieldIndex + indexShift].value = key;
      }
    }

    if (indexShift === -1) {
      if (focusedCodeTextFieldIndex <= 0 || currentCodeTextField.value) {
        return currentCodeTextField.clear();
      }

      if (!currentCodeTextField.value) {
        this.codeTextFields[focusedCodeTextFieldIndex + indexShift].clear();
      }
    }

    this.codeTextFields[focusedCodeTextFieldIndex + indexShift].focus();
  }

  _submit = () => {
    const code = this.codeTextFields.map(textField => textField.value).join('');

    if (code.length < 6) {
      return this.setState({ error: 'Invalid login code.' });
    }

    // do login stuff

    //temp
    this.props.navigation.navigate('SetupProfile');
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
          <BabbleFieldLabel containerStyle={styles.codeFieldLabel}>
            {(sendingText) ? "We're texting you your login code..." : 'Enter the code we texted you'}
          </BabbleFieldLabel>

          <View style={styles.codeContainer}>
            {Array(6).fill(null).map((value, index) => (
              <BabbleTextField
                maxLength={1}
                onKeyPress={this._onKeyPress}
                onFocus={() => this.setState({ focusedCodeTextFieldIndex: index })}
                keyboardType={'phone-pad'}
                containerStyle={styles.codeTextField}
                style={styles.codeTextFieldInput}
                key={`code_${index}`}
                ref={component => this.codeTextFields[index] = component}
              />
            ))}

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

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
  },
  codeTextField: {
    width: 50,
  },
  codeTextFieldInput: {
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 35,
  },
  errorText: {
    position: 'absolute',
    bottom: -26,
    color: '#F53333',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
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
