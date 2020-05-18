import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { BabbleConversationMessage } from './';

export default class BabbleConversation extends Component {
  flatlist = null;

  state = {
    autoscroll: true,
  }

  _renderMessage = ({ item, index }) => {
    const { messages } = this.props;

    return (
      <BabbleConversationMessage
        heading={(
          !index ||
          messages[index - 1].user.id !== item.user.id ||
          (item.createdAt - messages[index - 1].createdAt) / 1000 > 60 * 15
        )}
        {...item}
      />
    );
  }

  _scrollBeginDrag = () => {
    this.setState({ autoscroll: false });
  }

  _endReached = () => {
    this.setState({ autoscroll: true });
  }

  render() {
    const { messages, style } = this.props;

    return (
      <FlatList
        data={messages}
        renderItem={this._renderMessage}
        keyExtractor={item => `${item.id}`}
        onScrollBeginDrag={this._scrollBeginDrag}
        onEndReached={this._endReached}
        onEndReachedThreshold={0}
        style={[ styles.container, style ]}
        ref={component => this.flatlist = component}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
