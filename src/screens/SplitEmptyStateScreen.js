import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class SplitEmptyStateScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logoText}>Babble</Text>
        <Text style={styles.betaText}>Beta</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  betaText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 20,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoText: {
    color: '#1ACCB4',
    fontFamily: 'Lobster-Regular',
    fontSize: 90,
    letterSpacing: -3,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
