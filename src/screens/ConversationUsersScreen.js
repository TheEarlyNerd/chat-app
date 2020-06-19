import React, { Component } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleUserPreview } from '../components';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;

export default class ConversationUsersScreen extends Component {
  state = {
    conversationUsers: null,
  }

  async componentDidMount() {
    const { conversationId } = this.props.route.params;
    const conversationUsers = await conversationsManager.getConversationUsers(conversationId);

    this.setState({ conversationUsers });
  }

  _renderItem = ({ item, index }) => {
    return (
      <BabbleUserPreview
        user={item.user}
      />
    );
  }

  _renderFooter = () => {
    const { conversationUsers } = this.state;

    if (conversationUsers) {
      return null;
    }

    return (
      <ActivityIndicator size={'large'} />
    );
  }

  render() {
    const { conversationUsers } = this.state;

    return (
      <FlatList
        data={conversationUsers}
        renderItem={this._renderItem}
        keyExtractor={(item, index) => `${item.id}.${index}`}
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
