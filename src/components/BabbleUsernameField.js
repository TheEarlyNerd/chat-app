import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { BabbleTextField } from './';

const BabbleUsernameField = props => (
  <BabbleTextField
    returnKeyType={'done'}
    autoCorrect={false}
    autoCapitalize={'none'}
    inputPrefix={(
      <Text style={styles.prefixText}>@</Text>
    )}
    {...props}
  />
);

export default BabbleUsernameField;

const styles = StyleSheet.create({
  prefixText: {
    color: '#9B9B9B',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 26,
    marginLeft: 10,
  },
});
