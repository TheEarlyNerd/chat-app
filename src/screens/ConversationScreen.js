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
    messages: [],
  }

  componentDidMount() {
    this.props.navigation.setOptions({ title: 'New Conversation' });
  }

  _onMessageSubmit = async ({ text, selectedMedia }) => {
    const { conversation } = this.state;

    this.messageComposer.clear();

    if (!conversation) {
      const temp = await conversationsManager.createConversation({
        accessLevel: this.userSelector.accessLevel, // naming weird here, more than just user selector
        users: this.userSelector.selectedUsers.map(selectedUser => selectedUser.id),
        message: { text },
      });

      console.log(temp);
    }
  }

  render() {
    const { messages } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <BabbleConversationUserSelectionToolbar
          label={'To:'}
          placeholder={'The World'}
          ref={component => this.userSelector = component}
        />

        <BabbleConversation
          messages={messages}
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
