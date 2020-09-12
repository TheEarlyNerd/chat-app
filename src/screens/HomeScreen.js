import React, { Component } from 'react';
import { BabbleFeed } from '../components';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;

export default class HomeScreen extends Component {
  static contextType = NavigationTypeContext;

  state = {
    conversations: null,
    canLoadMore: true,
  }

  componentDidMount() {
    maestro.link(this);

    this._loadConversations();
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ conversations }) {
    this.setState({ conversations: conversations.recentConversations });
  }

  receiveEvent(name, value) {
    if (name === 'APP_STATE_CHANGED' && value === 'active') {
      this._loadConversations();
    }
  }

  _loadConversations = async () => {
    await conversationsManager.loadRecentConversations({ limit: 15 });

    this.setState({ canLoadMore: true });
  }

  _loadMore = async () => {
    const { conversations } = this.state;

    if (!conversations?.length) {
      return;
    }

    const result = await conversationsManager.loadRecentConversations({
      staler: conversations[conversations.length - 1].lastMessageAt,
    });

    this.setState({ canLoadMore: !!result.length });
  }

  _generateData = () => {
    const { conversations } = this.state;

    const mapItems = (items, type) => items.map((item, index) => {
      if (index === items.length - 1) {
        item.last = true;
      }

      if (type) {
        item[type] = true;
      }

      return item;
    });

    return [
      ...((!!conversations && conversations.length) ? [
        ...mapItems(conversations, 'conversationPreview'),
      ] : []),

      ...((!conversations) ? [
        { id: 'loading', loading: true, last: true },
      ] : []),
    ];
  }

  render() {
    return (
      <BabbleFeed
        onEndReached={this._loadMore}
        onRefresh={this._loadConversations}
        generateData={this._generateData}
        canLoadMore={this.state.canLoadMore}
      />
    );
  }
}
