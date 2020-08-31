import React, { Component } from 'react';
import { View, Text, Animated, ActivityIndicator, Keyboard, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { BabbleConversationMessage, BabbleConversationMessageOptions } from './';

export default class BabbleConversation extends Component {
  swipeListView = null;
  swipeOpenAnimatedValues = {};

  state = {
    autoscroll: true,
    lazyLoading: false,
  }

  scrollToEnd = animated => {
    this.swipeListView.scrollToOffset({ offset: 0, animated });
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
    if (this.state.autoscroll) {
      Keyboard.dismiss();
    }

    this.setState({ autoscroll: false });
  }

  _contentSizeChange = () => {
    const { messages } = this.props;
    const { autoscroll } = this.state;

    if (messages && autoscroll) {
      this.scrollToEnd(false);
    }
  }

  _swipeValueChange = ({ key, value, isOpen }) => {
    if (value <= 0) {
      this.swipeOpenAnimatedValues[key].setValue(Math.abs(value) / 145);
    } else {
      this.swipeOpenAnimatedValues[key].setValue(Math.abs(value) / 60);
    }
  }

  _rowOpen = (rowKey, rowMap, toValue) => {
    if (toValue > 0) { // left row (reply)
      setTimeout(() => {
        this._closeRow(rowMap[rowKey]);

        console.log('TODO: Support replies');
      }, 750);
    }
  }

  _closeRow = swipeRow => {
    return new Promise(resolve => {
      swipeRow.closeRow();
      setTimeout(resolve, 400);
    });
  }

  _onScroll = ({ nativeEvent: { contentOffset } }) => {
    if (!this.state.autoscroll && contentOffset.y <= 0) {
      this.setState({ autoscroll: true });
    }
  }

  _endReached = async () => {
    const { messages, loadOldMessages } = this.props;
    const { lazyLoading } = this.state;

    if (lazyLoading || lazyLoading === null || !messages) {
      return;
    }

    this.setState({ lazyLoading: true });

    const loadedOldMessages = await loadOldMessages();

    this.setState({ lazyLoading: (loadedOldMessages.length) ? false : null });
  }

  _renderMessage = ({ item, index }) => {
    const { messages } = this.props;
    const itemKey = this._getItemKey(item);

    if (!this.swipeOpenAnimatedValues[itemKey]) {
      this.swipeOpenAnimatedValues[itemKey] = new Animated.Value(0);
    }

    return (
      <BabbleConversationMessage
        message={item}
        heading={(
          index === messages.length - 1 ||
          messages[index + 1].conversationUser.userId !== item.conversationUser.userId ||
          (item.createdAt - messages[index + 1].createdAt) / 1000 > 60 * 15
        )}
        style={{
          minHeight: this.swipeOpenAnimatedValues[itemKey].interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ 0, 55 ],
            extrapolate: 'clamp',
          }),
        }}
      />
    );
  }

  _renderMessageOptions = ({ item, index }, rowMap) => {
    const itemKey = this._getItemKey(item);

    return (
      <BabbleConversationMessageOptions
        onCloseRow={() => this._closeRow(rowMap[itemKey])}
        style={{ opacity: this.swipeOpenAnimatedValues[itemKey] }}
        {...item}
      />
    );
  }

  _renderLoading = () => {
    return (
      <ActivityIndicator size={'large'} />
    );
  }

  _getItemKey = item => {
    return (item.nonce) ? `${item.nonce}` : `${item.id}`;
  }

  render() {
    const { messages, style } = this.props;
    const { lazyLoading } = this.state;
    const typingText = this._getTypingText();

 // maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: 0 }} /* TODO: This will not work on Android, new messages will cause chat to jump. */
    return (
      <View style={styles.container}>
        <SwipeListView
          data={messages}
          inverted
          renderItem={this._renderMessage}
          renderHiddenItem={this._renderMessageOptions}
          keyExtractor={this._getItemKey}
          onScrollBeginDrag={this._scrollBeginDrag}
          onContentSizeChange={this._contentSizeChange}
          onSwipeValueChange={this._swipeValueChange}
          onRowOpen={this._rowOpen}
          onScroll={this._onScroll}
          onEndReached={this._endReached}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={150}
          closeOnRowBeginSwipe
          closeOnScroll={false}
          /*leftOpenValue={60} TODO: Support replies */
          rightOpenValue={-145}
          recalculateHiddenLayout
          contentContainerStyle={styles.contentContainer}
          style={[ styles.container, style ]}
          ListFooterComponent={(lazyLoading) ? this._renderLoading : null}
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
