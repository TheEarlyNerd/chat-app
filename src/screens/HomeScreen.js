import React, { Component } from 'react';
import { BabbleFeed } from '../components';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { conversationsManager, userManager } = maestro.managers;

export default class HomeScreen extends Component {
  static contextType = NavigationTypeContext;

  state = {
    conversations: null,
    search: null,
    searchUsers: null,
    searchConversations: null,
    loadingSearch: false,
    canLoadMore: true,
  }

  searchTextInputTimeout = null;

  componentDidMount() {
    maestro.link(this);

    this._loadConversations();
  }

  componentWillUnmount() {
    maestro.unlink(this);

    clearTimeout(this.searchTextInputTimeout);
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
    const {
      conversations,
      search,
      searchUsers,
      searchConversations,
      loadingSearch,
    } = this.state;

    const mapItems = (items, type) => items.map((item, index) => {
      if (index === items.length - 1) {
        item.last = true;
      }

      if (type) {
        item[type] = true;
      }

      return item;
    });

    if (search) {
      return [
        { id: 'search', search: true },
        { id: 'searchUsers', title: 'Users', header: true },
        ...((!!searchUsers && !loadingSearch && searchUsers.length) ? [
          ...mapItems(searchUsers, 'userPreview'),
        ] : [
          (!loadingSearch)
            ? { id: 'searchUsersNoResults', last: true, noResults: true }
            : { id: 'searchUsersLoading', last: true, loading: true },
        ]),

        { id: 'searchConversations', title: 'Conversations', header: true },
        ...((!!searchConversations && !loadingSearch && searchConversations.length) ? [
          ...mapItems(searchConversations, 'conversationPreview'),
        ] : [
          (!loadingSearch)
            ? { id: 'searchConversationsNoResults', last: true, noResults: true }
            : { id: 'searchConversationsLoading', last: true, loading: true },
        ]),
      ];
    }

    return [
      { id: 'search', search: true },

      ...((!!conversations && conversations.length) ? [
        ...mapItems(conversations, 'conversationPreview'),
      ] : []),

      ...((!conversations) ? [
        { id: 'loading', loading: true, last: true },
      ] : []),
    ];
  }

  _onSearchChange = async text => {
    this.setState({ search: text });

    clearTimeout(this.searchTextInputTimeout);

    if (!text) {
      return this.setState({ canLoadMore: true });
    } else {
      this.setState({ loadingSearch: true, canLoadMore: false });
    }

    this.searchTextInputTimeout = setTimeout(async () => {
      const searchUsers = await userManager.searchUsers(text);
      const searchConversations = await conversationsManager.searchConversations(text);

      this.setState({
        search: text,
        searchUsers,
        searchConversations,
        loadingSearch: false,
      });
    }, 500);
  }

  render() {
    return (
      <BabbleFeed
        onEndReached={this._loadMore}
        onRefresh={this._loadConversations}
        onSearchChange={this._onSearchChange}
        generateData={this._generateData}
        canLoadMore={this.state.canLoadMore}
      />
    );
  }
}
