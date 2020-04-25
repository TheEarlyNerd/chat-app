import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { BabbleHeader, BabbleConversationPreviewMessage, BabbleSearchField, BabbleUserAvatar } from '../components';
import { UserIcon, EyeIcon } from '../components/icons';

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BabbleHeader style={styles.header} />

        <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
          <BabbleSearchField
            placeholder={'Search users and conversations...'}
            containerStyle={styles.searchField}
          />

          <Text style={styles.headingText}>Direct Messages</Text>

          {Array(2).fill(null).map((value, index) => (
            <BabbleConversationPreviewMessage
              style={styles.conversationPreviewMessage}
              key={`prev_${index}`}
            />
          ))}

          <Text style={styles.headingText}>My Conversations</Text>

          {Array(2).fill(null).map((value, index) => (
            <BabbleConversationPreviewMessage
              style={styles.conversationPreviewMessage}
              key={`prev_${index}`}
              conversation
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingTop: 140,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  searchField: {
    marginBottom: 40,
  },
  headingText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: 26,
    marginBottom: 20,
  },
  conversationPreviewMessage: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E1E3E8',
  },

});
