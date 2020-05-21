import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { BabbleConversationMessage } from './';

export default class BabbleConversation extends Component {
  flatlist = null;
  autoscrollTimeout = null;

  state = {
    autoscroll: true,
  }

  componentWillUnmount() {
    clearTimeout(this.autoscrollTimeout);
  }

  _scrollBeginDrag = () => {
    this.setState({ autoscroll: false });
  }

  _contentSizeChange = () => {
    const { messages } = this.props;
    const { autoscroll } = this.state;

    if (messages && autoscroll) {
      clearTimeout(this.autoscrollTimeout);

      this.autoscrollTimeout = setTimeout(() => {
        this.flatlist.scrollToEnd({ animated: true });
      }, 10);
    }
  }

  _endReached = () => {
    this.setState({ autoscroll: true });
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

  render() {
    const { messages, style } = this.props;

    return (
      <FlatList
        data={messages}
        renderItem={this._renderMessage}
        keyExtractor={item => `${item.nonce}`}
        onScrollBeginDrag={this._scrollBeginDrag}
        onContentSizeChange={this._contentSizeChange}
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
