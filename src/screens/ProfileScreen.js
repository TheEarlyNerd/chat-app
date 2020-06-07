import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleConversationPreviewsList, BabbleProfileHeader } from '../components';
import maestro from '../maestro';

const { userManager, conversationsManager } = maestro.managers;
const { interfaceHelper } = maestro.helpers;

export default class ProfileScreen extends Component {
  state = {
    user: null,
    conversations: null,
  }

  async componentDidMount() {
    maestro.link(this);

    const params = this.props.route.params || {};
    const { userId } = params;

    try {
      const user = await userManager.getUser(userId);
      this.setState({ user });
      this.props.navigation.setOptions({ title: `@${user.username}` });

      const conversations = await conversationsManager.getConversationsByUserId(userId);
      this.setState({ conversations });
    } catch (error) {
      interfaceHelper.showError({ message: error.message });
      this.props.navigation.pop();
    }
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ user }) {
    this.setState({ user: user.user });
  }

  _renderHeader = () => {
    return (
      <BabbleProfileHeader
        user={this.state.user}
        showEdit={this.state.user.id === userManager.store.user.id}
      />
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
        ListHeaderComponent={this._renderHeader}
        ListHeaderComponentStyle={styles.header}
        ListFooterComponent={(conversations === null) ? this._renderFooter : null}
        ListFooterComponentStyle={styles.footer}
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
    paddingTop: 40,
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
});
