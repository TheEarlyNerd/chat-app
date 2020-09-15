import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class BabbleHomeEmptyView extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>You Haven't Created Or Joined Any Rooms</Text>
        <Text style={styles.subText}>Quickly pop in and out of every room you join or create from here.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  subText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 14, lg: 15 }),
    lineHeight: 22,
    textAlign: 'center',
  },
  titleText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});
