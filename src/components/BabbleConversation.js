import React, { Component } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { BabbleConversationMessage } from './';

export default class BabbleConversation extends Component {
  render() {
    const { style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <FlatList

        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
