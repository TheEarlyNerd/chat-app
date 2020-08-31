import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleConversationPreviewsList } from '../components';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;

export default class CovnersationsListScreen extends Component {
  state = {
    conversations: null,
  }

  componentDidMount() {
    maestro.link(this);

    this._loadConversations();
  }

  receiveStoreUpdate({ conversations }) {
    const params = this.props.route.params || {};
    const { type } = params;

    if (type === 'recent') {
      this.setState({ conversations: conversations.recentConversations });
    }

    if (type === 'private') {
      this.setState({ conversations: conversations.privateConversations });
    }

    if (type === 'feed') {
      this.setState({ conversations: conversations.feedConversations });
    }

    if (type === 'explore') {
      this.setState({ conversations: conversations.exploreConversations });
    }
  }

  _loadConversations = async refresh => {
    const params = this.props.route.params || {};
    const { type } = params;
    const { conversations } = this.state;
    const queryParams = { limit: 15 };

    if (conversations?.length && !refresh && type === 'feed') {
      queryParams.before = conversations[conversations.length - 1].createdAt;
    }

    if (conversations?.length && !refresh && [ 'recent', 'private', 'explore' ].includes(type)) {
      queryParams.staler = conversations[conversations.length - 1].lastMessageAt;
    }

    if (type === 'recent') {
      return conversationsManager.loadRecentConversations(queryParams);
    }

    if (type === 'private') {
      return conversationsManager.loadPrivateConversations(queryParams);
    }

    if (type === 'feed') {
      return conversationsManager.loadFeedConversations(queryParams);
    }

    if (type === 'explore') {
      return conversationsManager.loadExploreConversations(queryParams);
    }
  }

  _renderEmpty = () => {
    const { conversations } = this.state;

    if (conversations) {
      return null;
    }

    return (
      <ActivityIndicator size={'large'} />
    );
  }

  render() {
    const { conversations } = this.state;

    return (
      <BabbleConversationPreviewsList
        conversations={conversations}
        loadConversations={this._loadConversations}
        ListEmptyComponent={this._renderEmpty}
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
});
