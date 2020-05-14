import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { BabbleConversationMessage } from './';

export default class BabbleConversation extends Component {
  _renderMessage = ({ item, index }) => {
    const { messages } = this.props;

    return (
      <BabbleConversationMessage
        heading={!index || messages[index - 1].user.id !== item.user.id}
        {...item}
      />
    );
  }

  render() {
    const { messages, style } = this.props;

    return (
      <FlatList
        data={messages}
        renderItem={this._renderMessage}
        keyExtractor={item => `${item.id}`}
        style={[ styles.container, style ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
