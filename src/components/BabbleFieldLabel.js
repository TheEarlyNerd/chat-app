import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

const BabbleFieldLabel = props => (
  <View style={[ styles.container, props.containerStyle ]}>
    <Text style={styles.labelText}>{props.children}</Text>
    {props.postfix}
  </View>
);

export default BabbleFieldLabel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  labelText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 18, lg: 22 }),
  },
});
