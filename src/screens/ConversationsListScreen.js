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
    const { conversations } = this.state;

    return (
      <BabbleConversationPreviewsList
        conversations={conversations}
        ListFooterComponent={this._renderFooter}
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
