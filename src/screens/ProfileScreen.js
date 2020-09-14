import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleConversationPreviewsList, BabbleProfileHeader } from '../components';
import maestro from '../maestro';

const { userManager, conversationsManager } = maestro.managers;

export default class ProfileScreen extends Component {
  state = {
    user: null,
    conversations: null,
    refreshing: false,
  }

  async componentDidMount() {
    maestro.link(this);

    const params = this.props.route.params || {};
    const { userId } = params;
    const user = await userManager.getUser(userId);

    this.setState({ user });

    this.props.navigation.setOptions({ title: (user.username) ? `@${user.username}` : 'Invited User' });

    this._loadConversations();
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ conversations, user }) {
    if (!this.state.user) {
      return;
    }

    const state = { conversations: conversations.usersConversations[this.state.user.id] };

    if (this.state.user.id === user.user.id) {
      state.user = user.user;
    }

    this.setState(state);
  }

  _loadConversations = async refresh => {
    const params = this.props.route.params || {};
    const { userId } = params;
    const { conversations } = this.state;

    return conversationsManager.loadUsersConversations({
      userId,
      queryParams: (conversations && !refresh) ? {
        before: conversations[conversations.length - 1].createdAt,
      } : null,
    });
  }

  _renderHeader = () => {
    return (
      <BabbleProfileHeader
        user={this.state.user}
        showEdit={this.state.user.id === userManager.store.user.id}
      />
    );
  }

  _renderNoConversations = () => {
    const { user } = this.state;

    return (
      <View style={styles.noConversationsContainer}>
        <Text style={styles.noConversationsText}>{user.name} hasn't started or shared any rooms.</Text>
      </View>
    );
  }

  _renderFooter = () => {
    return (
      <ActivityIndicator size={'large'} />
    );
  }

  _renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  render() {
    const { user, conversations } = this.state;

    if (!user) {
      return this._renderLoading();
    }

    return (
      <BabbleConversationPreviewsList
        conversations={conversations}
        loadConversations={this._loadConversations}
        ListHeaderComponent={this._renderHeader}
        ListHeaderComponentStyle={styles.header}
        ListFooterComponent={(conversations === null) ? this._renderFooter : null}
        ListFooterComponentStyle={styles.footer}
        ListEmptyComponent={this._renderNoConversations}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  footer: {
    marginTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noConversationsContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
  },
  noConversationsText: {
    color: '#4F4F4F',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
});
