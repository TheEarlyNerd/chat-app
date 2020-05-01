import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { BabbleHeader, BabbleUserSelectionToolbar, BabbleMessageComposerToolbar } from '../components';

export default class ConversationScreen extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <BabbleHeader
          back
          title={'New Message'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
        />

        <BabbleUserSelectionToolbar
          label={'To:'}
          placeholder={'The World'}
          style={{ marginTop: 100 }}
        />

        <ScrollView style={{ flex: 1 }} />

        <BabbleMessageComposerToolbar />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
