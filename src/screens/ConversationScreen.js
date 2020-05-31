import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { BabbleConversationUserSelectionToolbar, BabbleConversationUsersToolbar, BabbleConversation, BabbleConversationMessageComposerToolbar } from '../components';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;

export default class ConversationScreen extends Component {
  messageComposer = null;
  userSelector = null;

  state = {
    conversation: null,
  }

  componentDidMount() {
    maestro.link(this);

    const params = this.props.route.params || {};
    const { conversationId } = params;

    this.props.navigation.setOptions({ title: (conversationId) ? 'Conversation' : 'New Conversation' });

    if (conversationId) {
//      setInterval(() => {
        conversationsManager.loadActiveConversation(conversationId);
//      }, 1000);
    } else {
      this.props.navigation.setOptions({ title: 'New Conversation' });
    }
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ conversations, user }) {
    this.setState({ conversation: conversations.activeConversation });
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
      await conversationsManager.createConversation({
        accessLevel: this.userSelector.accessLevel, // TODO: naming weird here, more than just user selector
        users: this.userSelector.selectedUsers.map(selectedUser => selectedUser.id),
        message: { text, attachments },
      });
    }
  }

  render() {
    const params = this.props.route.params || {};
    const { conversationId } = params;
    const { conversation } = this.state;
    const { conversationMessages } = conversation || {};

    return (
      <SafeAreaView style={styles.container}>
        {!conversationId && (
          <BabbleConversationUserSelectionToolbar
            ref={component => this.userSelector = component}
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
