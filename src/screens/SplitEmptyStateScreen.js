import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class SplitEmptyStateScreen extends Component {
  render() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00FF00',
    flex: 1,
  },
});
