import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { BabbleTextField } from './';

export default class BabbleUsernameField extends Component {
  textField = null;

  focus() {
    this.textField.focus();
  }

  render() {
    return (
      <BabbleTextField
        returnKeyType={'done'}
        autoCorrect={false}
        autoCapitalize={'none'}
        inputPrefix={(
          <Text style={styles.prefixText}>@</Text>
        )}
        ref={component => this.textField = component}
        {...this.props}
      />
    );
  }
}

const styles = StyleSheet.create({
  prefixText: {
    color: '#9B9B9B',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 26,
    marginLeft: 10,
  },
});