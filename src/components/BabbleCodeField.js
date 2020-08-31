import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BabbleFieldLabel, BabbleTextField } from './';

export default class BabbleCodeField extends Component {
  state = {
    focusedTextFieldIndex: 0,
    value: '',
  }

  textField = null;

  get value() {
    return this.state.value;
  }

  focus() {
    this.textField.focus();
  }

  render() {
    const { label, error, style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <BabbleFieldLabel containerStyle={styles.fieldLabel}>{label}</BabbleFieldLabel>

        <View style={styles.codeContainer}>
          <BabbleTextField
            maxLength={6}
            keyboardType={'phone-pad'}
            textContentType={'oneTimeCode'}
            onChangeText={text => this.setState({ value: text })}
            containerStyle={styles.textField}
            style={styles.textFieldInput}
            ref={component => this.textField = component}
          />

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
  textFieldInput: {
    letterSpacing: 15,
    textAlign: 'center',
  },
});
