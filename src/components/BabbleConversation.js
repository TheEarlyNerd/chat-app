import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { BabbleConversationMessage, BabbleConversationMessageOptions } from './';

export default class BabbleConversation extends Component {
  autoscrollTimeout = null;
  swipeListView = null;
  swipeOpenAnimatedValues = {};

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
        this.swipeListView.scrollToEnd({ animated: true });
      }, 10);
    }
  }

  _endReached = () => {
    this.setState({ autoscroll: true });
  }

  _swipeValueChange = ({ key, value, isOpen }) => {
    if (value <= 0) {
      this.swipeOpenAnimatedValues[key].setValue(Math.abs(value) / 145);
    } else {
      this.swipeOpenAnimatedValues[key].setValue(Math.abs(value) / 60);
    }
  }

  _closeRow = swipeRow => {
    return new Promise(resolve => {
      swipeRow.closeRow();
      setTimeout(resolve, 400);
    });
  }

  _renderMessage = ({ item, index }) => {
    const { messages } = this.props;

    if (!this.swipeOpenAnimatedValues[item.nonce]) {
      this.swipeOpenAnimatedValues[item.nonce] = new Animated.Value(0);
    }

    return (
      <BabbleConversationMessage
        heading={(
          !index ||
          messages[index - 1].user.id !== item.user.id ||
          (item.createdAt - messages[index - 1].createdAt) / 1000 > 60 * 15
        )}
        style={{
          minHeight: this.swipeOpenAnimatedValues[item.nonce].interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ 0, 55 ],
            extrapolate: 'clamp',
          }),
        }}
        {...item}
      />
    );
  }

  _renderMessageOptions = ({ item, index }, rowMap) => {
    return (
      <BabbleConversationMessageOptions
        onCloseRow={() => this._closeRow(rowMap[item.nonce])}
        style={{ opacity: this.swipeOpenAnimatedValues[item.nonce] }}
        {...item}
      />
    );
  }

  render() {
    const { messages, style } = this.props;

    return (
      <SwipeListView
        data={messages}
        renderItem={this._renderMessage}
        renderHiddenItem={this._renderMessageOptions}
        keyExtractor={item => `${item.nonce}`}
        onScrollBeginDrag={this._scrollBeginDrag}
        onContentSizeChange={this._contentSizeChange}
        onEndReached={this._endReached}
        onEndReachedThreshold={0}
        onSwipeValueChange={this._swipeValueChange}
        closeOnRowBeginSwipe
        closeOnScroll={false}
        rightOpenValue={-145}
        recalculateHiddenLayout
        style={[ styles.container, style ]}
        listViewRef={component => this.swipeListView = component}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
