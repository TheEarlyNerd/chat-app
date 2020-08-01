import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleConversationPreviewsList } from '../components';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;

export default class CovnersationsListScreen extends Component {
  state = {
    conversations: null,
    refreshing: false,
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

  _loadConversations = async () => {
    const params = this.props.route.params || {};
    const { type } = params;

    if (type === 'recent') {
      conversationsManager.loadRecentConversations();
    }

    if (type === 'private') {
      conversationsManager.loadPrivateConversations();
    }

    if (type === 'feed') {
      conversationsManager.loadFeedConversations();
    }

    if (type === 'explore') {
      conversationsManager.loadExploreConversations();
    }
  }

  _refresh = async () => {
    this.setState({ refreshing: true });

    await this._loadConversations();

    this.setState({ refreshing: false });
  }

  _renderFooter = () => {
    const { conversations } = this.state;

    if (conversations) {
      return null;
    }

    return (
      <ActivityIndicator size={'large'} />
    );
  }

  render() {
    const { conversations, refreshing } = this.state;

    return (
      <BabbleConversationPreviewsList
        conversations={conversations}
        ListFooterComponent={this._renderFooter}
        contentContainerStyle={styles.contentContainer}
        refreshing={refreshing}
        onRefresh={this._refresh}
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
