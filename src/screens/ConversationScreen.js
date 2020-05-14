import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { BabbleConversationUserSelectionToolbar, BabbleConversationUsersToolbar, BabbleConversation, BabbleConversationMessageComposerToolbar } from '../components';

export default class ConversationScreen extends Component {
  componentDidMount() {
    this.props.navigation.setOptions({ title: 'New Message' });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BabbleConversationUserSelectionToolbar
          label={'To:'}
          placeholder={'The World'}
        />

        <BabbleConversation />

        <BabbleConversationMessageComposerToolbar />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
