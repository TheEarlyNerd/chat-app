import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { BabbleConversationUserSelectionToolbar, BabbleConversationUsersToolbar, BabbleConversation, BabbleConversationMessageComposerToolbar } from '../components';

export default class ConversationScreen extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <BabbleConversationUsersToolbar />

        <BabbleConversation />

        <BabbleConversationMessageComposerToolbar />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
