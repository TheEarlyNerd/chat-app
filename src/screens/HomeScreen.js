import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BabbleHeader, BabbleConversationPreview, BabbleSearchField } from '../components';

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BabbleHeader style={styles.header} navigation={this.props.navigation} />

        <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
          <BabbleSearchField
            placeholder={'Search users and conversations...'}
            containerStyle={styles.searchField}
          />

          <Text style={styles.headingText}>Direct Messages</Text>

          <BabbleConversationPreview
            conversation={{
              id: 1,
              accessLevel: 'private',
              previewConversationMessage: {
                text: 'Yo, just got my rad rover, it is freaking awesome - check it out!',
                conversationMessageReactions: [],
                tempUnread: true,
                tempImage: 'https://i.ytimg.com/vi/p-8q3C4-_LA/maxresdefault.jpg',
              },
              user: {
                name: 'Alex Filatov',
                avatarAttachment: { url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p480x480/12717707_10205908719979367_3491263903448795284_n.jpg?_nc_cat=102&_nc_sid=dbb9e7&_nc_oc=AQkY9cvHDPkTZjpHJB2AJfWXDxK4jZexz9WgtKReqGes73lh-ujVIyMcXJRyu0LQCjbfewvRZ4lc5mRWUyJbx1n8&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=35573a80e7c0f39280d1dcbea302638b&oe=5ECB2090' },
              },
              tempGroup: true,
            }}
            style={styles.conversationPreview}
          />

          <BabbleConversationPreview
            conversation={{
              id: 2,
              accessLevel: 'private',
              previewConversationMessage: {
                text: 'Chino Lex: Confident how?',
                conversationMessageReactions: [],
              },
              user: {
                name: 'Chino Lex, Spencer Costanzo',
                avatarAttachment: { url: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p200x200/27540184_10210530825621359_6792294337055482922_n.jpg?_nc_cat=105&_nc_sid=dbb9e7&_nc_oc=AQkW_rYeyTAD2sOneum0FOCwEuEukpbU1RSz8Pl2k28v6WYffZ9v-AbfvI8cSLcGaQmwdRElIqjLWuRZaxXy4bBq&_nc_ht=scontent-sea1-1.xx&_nc_tp=6&oh=295eea332bb1c7d02054965b94e9228f&oe=5ECB1387' },
              },
              tempGroup: true,
            }}
            style={styles.conversationPreview}
          />

          <Text style={styles.headingText}>Feed</Text>

          <BabbleConversationPreview
            conversation={{
              id: 3,
              accessLevel: 'protected',
              previewConversationMessage: {
                text: 'David Dobrik: No way blah blah loren ipsum blah blah delor smhemt',
                conversationMessageReactions: [],
              },
              user: {
                name: 'David Dobrik, Jason Nash',
                avatarAttachment: { url: 'https://pbs.twimg.com/profile_images/1223706175910211584/tmu8d9fA_400x400.jpg' },
              },
              tempGroup: true,
            }}
            style={styles.conversationPreview}
          />

          <BabbleConversationPreview
            conversation={{
              id: 3,
              accessLevel: 'public',
              previewConversationMessage: {
                text: 'Starlink will deliver high speed broadband internet to locations where access has been unreliable, expensive, or completely unavailable',
                conversationMessageReactions: [],
                tempImage: 'https://pbs.twimg.com/media/EWNf6vmWAAAUW_P?format=jpg&name=900x900',
                tempUnread: true,
              },
              user: {
                name: 'SpaceX',
                avatarAttachment: { url: 'https://pbs.twimg.com/profile_images/1082744382585856001/rH_k3PtQ_400x400.jpg' },
              },
            }}
            style={styles.conversationPreview}
          />

          <Text style={styles.headingText}>Explore</Text>

          <BabbleConversationPreview
            conversation={{
              id: 3,
              accessLevel: 'public',
              previewConversationMessage: {
                text: 'tom cotton has a real "Where Waldo with two DUIs" vibe...',
                conversationMessageReactions: [
                  {
                    reaction: '🤣🤣',
                    count: 22,
                  },
                  {
                    reaction: 'YEP',
                    count: 16,
                  },
                  {
                    reaction: '💩💩💩',
                    count: 7,
                  },
                  {
                    reaction: '🙄',
                    count: 1,
                  },
                ],
                tempImage: 'https://pbs.twimg.com/media/EWjYw57UYAADO54?format=jpg&name=medium',
              },
              user: {
                name: 'patric',
                avatarAttachment: { url: 'https://pbs.twimg.com/profile_images/1191079862502510592/qk_CfP12_400x400.jpg' },
              },
            }}
            style={styles.conversationPreview}
          />

          <BabbleConversationPreview
            conversation={{
              id: 3,
              accessLevel: 'public',
              previewConversationMessage: {
                text: 'The best version of Naruto.. debate me if I am wrong...',
                conversationMessageReactions: [],
                tempImage: 'https://pbs.twimg.com/media/EWiLMcoWAAElg2y?format=jpg&name=900x900',
                tempUnread: true,
              },
              user: {
                name: 'Yeezybro',
                avatarAttachment: { url: 'https://pbs.twimg.com/profile_images/1243141865395957761/iwBQHkyL_400x400.jpg' },
              },
            }}
            style={styles.conversationPreview}
          />
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
    paddingHorizontal: 15,
    paddingTop: 140,
  },
  headingText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: 26,
    marginTop: 40,
  },
  conversationPreview: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D8D8D8',
  },

});
