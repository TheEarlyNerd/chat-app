import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { BabbleConversationMessage, BabbleConversationMessageOptions } from './';

export default class BabbleConversation extends Component {
  swipeListView = null;
  swipeOpenAnimatedValues = {};

  state = {
    autoscroll: true,
  }

  _getTypingText = () => {
    const typingUsers = this.props.typingUsers || [];

    if (!typingUsers.length) {
      return;
    }

    return (typingUsers.length > 1)
      ? `${typingUsers[0].name} & ${typingUsers.length - 1} others are typing...`
      : `${typingUsers[0].name} is typing...`;
  }

  _scrollBeginDrag = () => {
    this.setState({ autoscroll: false });
  }

  _contentSizeChange = () => {
    const { messages } = this.props;
    const { autoscroll } = this.state;

    if (messages && autoscroll) {
      this.swipeListView.scrollToOffset({ offset: 0, animated: false });
    }
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

  _onScroll = ({ nativeEvent: { contentOffset } }) => {
    if (contentOffset.y <= 0 && !this.state.autoscroll) {
      this.setState({ autoscroll: true });
    }
  }

  _endReached = () => {
    // load more.
  }

  _renderMessage = ({ item, index }) => {
    const { messages } = this.props;

    if (!this.swipeOpenAnimatedValues[item.nonce]) {
      this.swipeOpenAnimatedValues[item.nonce] = new Animated.Value(0);
    }

    return (
      <BabbleConversationMessage
        message={item}
        heading={(
          index === messages.length - 1 ||
          messages[index + 1].user.id !== item.user.id ||
          (item.createdAt - messages[index + 1].createdAt) / 1000 > 60 * 15
        )}
        style={{
          minHeight: this.swipeOpenAnimatedValues[item.nonce].interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ 0, 55 ],
            extrapolate: 'clamp',
          }),
        }}
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
    const typingText = this._getTypingText();

 // maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: 0 }} /* TODO: This will not work on Android, new messages will cause chat to jump. */
    return (
      <View style={styles.container}>
        <SwipeListView
          data={messages}
          inverted
          renderItem={this._renderMessage}
          renderHiddenItem={this._renderMessageOptions}
          keyExtractor={item => `${item.nonce}`}
          onScrollBeginDrag={this._scrollBeginDrag}
          onContentSizeChange={this._contentSizeChange}
          onSwipeValueChange={this._swipeValueChange}
          onScroll={this._onScroll}
          onEndReached={this._endReached}
          onEndReachedThreshold={0.2}
          scrollEventThrottle={0}
          closeOnRowBeginSwipe
          closeOnScroll={false}
          rightOpenValue={-145}
          recalculateHiddenLayout
          contentContainerStyle={styles.contentContainer}
          style={[ styles.container, style ]}
          listViewRef={component => this.swipeListView = component}
        />

        {!!typingText && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>{typingText}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 15,
    paddingTop: 20,
  },
  typingContainer: {
    bottom: 0,
    left: 0,
    paddingLeft: 20,
    paddingRight: 15,
    paddingVertical: 5,
    position: 'absolute',
    right: 0,
  },
  typingText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBoldItalic',
    fontSize: 12,
  },
});
