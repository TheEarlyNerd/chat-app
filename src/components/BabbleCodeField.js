import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BabbleFieldLabel, BabbleTextField } from './';

export default class BabbleCodeField extends Component {
  state = {
    focusedTextFieldIndex: 0,
  }

  textFields = [];

  get value() {
    return this.textFields.map(textField => textField.value).join('');
  }

  focus() {
    this.textFields[0].focus();
  }

  _onKeyPress = ({ nativeEvent }) => {
    const { key } = nativeEvent;
    const { focusedTextFieldIndex } = this.state;
    const currentTextField = this.textFields[focusedTextFieldIndex];
    const indexShift = (key !== 'Backspace') ? 1 : -1;

    if (indexShift === 1) {
      if (focusedTextFieldIndex >= this.textFields.length - 1) {
        return;
      }

      if (currentTextField.value && !this.textFields[focusedTextFieldIndex + indexShift].value) {
        this.textFields[focusedTextFieldIndex + indexShift].value = key;
      }
    }

    if (indexShift === -1) {
      if (focusedTextFieldIndex <= 0 || currentTextField.value) {
        return currentTextField.clear();
      }

      if (!currentTextField.value) {
        this.textFields[focusedTextFieldIndex + indexShift].clear();
      }
    }

    this.textFields[focusedTextFieldIndex + indexShift].focus();
  }

  render() {
    const { label, codeLength, error, style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <BabbleFieldLabel containerStyle={styles.fieldLabel}>{label}</BabbleFieldLabel>

        <View style={styles.codeContainer}>
          {Array(codeLength).fill(null).map((value, index) => (
            <BabbleTextField
              maxLength={1}
              onKeyPress={this._onKeyPress}
              onFocus={() => this.setState({ focusedTextFieldIndex: index })}
              keyboardType={'phone-pad'}
              containerStyle={styles.textField}
              style={styles.textFieldInput}
              key={index}
              ref={component => this.textFields[index] = component}
            />
          ))}

          {!!error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    width: '100%',
  },
  errorText: {
    bottom: -26,
    color: '#F53333',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
    position: 'absolute',
  },
  fieldLabel: {
    marginBottom: 8,
  },
  textField: {
    width: 50,
  },
  textFieldInput: {
    textAlign: 'center',
  },
});
