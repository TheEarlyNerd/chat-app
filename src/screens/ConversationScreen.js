import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { BabbleConversationComposerToolbar, BabbleConversationHeaderTitle, BabbleConversation, BabbleConversationMessageComposerToolbar } from '../components';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;

export default class ConversationScreen extends Component {
  conversationComposer = null;
  messageComposer = null;

  state = {
    conversation: null,
    showConversationComposer: !this.props.route?.params?.conversationId,
  }

  componentDidMount() {
    maestro.link(this);

    const conversationId = this.props.route?.params?.conversationId;
    const toUsers = this.props.route?.params?.toUsers;

    if (conversationId) {
      conversationsManager.loadActiveConversation(conversationId);
    } else {
      this.props.navigation.setOptions({ title: 'New Conversation' });
    }

    if (Array.isArray(toUsers)) {
      toUsers.forEach(user => this.conversationComposer.addUser(user));
    }
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ conversations, user }) {
    const { activeConversation } = conversations;

    if (activeConversation) {
      this.props.navigation.setOptions({
        title: <BabbleConversationHeaderTitle conversation={activeConversation} />,
      });
    }

    this.setState({ conversation: activeConversation });
  }

  _onMessageSubmit = async ({ text, attachments, embeds }) => {
    const { conversation } = this.state;

    this.messageComposer.clear();

    if (conversation) {
      await conversationsManager.createConversationMessage({
        conversationId: conversation.id,
        text,
        attachments,
        embeds,
      });
    } else {
      const createdConversation = await conversationsManager.createConversation({
        accessLevel: this.conversationComposer.accessLevel,
        title: this.conversationComposer.title,
        users: this.conversationComposer.selectedUsers.map(selectedUser => selectedUser.id),
        message: { text, attachments },
      });

      this.setState({ conversation: createdConversation });
    }

    this.setState({ showConversationComposer: false });
  }

  _onUserSelectionChange = ({ selectedUsers, accessLevel }) => {
    conversationsManager.resetActiveConversation();

    if (accessLevel === 'private' && selectedUsers.length) {
      conversationsManager.loadActivePrivateConversationByUserIds(selectedUsers.map(user => user.id));
    }
  }

  render() {
    const { conversation, showConversationComposer } = this.state;
    const { conversationMessages } = conversation || {};

    return (
      <SafeAreaView style={styles.container}>
        {showConversationComposer && (
          <BabbleConversationComposerToolbar
            onUserSelectionChange={this._onUserSelectionChange}
            ref={component => this.conversationComposer = component}
          />
        )}

        <BabbleConversation
          messages={conversationMessages}
        />

        <BabbleConversationMessageComposerToolbar
          onSubmit={this._onMessageSubmit}
          ref={component => this.messageComposer = component}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
