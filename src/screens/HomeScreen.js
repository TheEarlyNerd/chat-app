import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BabbleConversationPreviewsList, BabbleSearchField } from '../components';
import { EditIcon } from '../components/icons';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;

export default class HomeScreen extends Component {
  state = {
    conversations: null,
  }

  componentDidMount() {
    maestro.link(this);

    conversationsManager.loadConversations();
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ conversations, user }) {
    console.log('got update');
    console.log(conversations);
    console.log(user.user);
    this.setState({ conversations: conversations.conversations.filter(conversation => conversation.accessLevel === 'private') });
  }

  render() {
    const { conversations } = this.state;

    console.log(conversations);

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
          <BabbleSearchField
            placeholder={'Search users and conversations...'}
            containerStyle={styles.searchField}
          />

          <BabbleConversationPreviewsList
            conversations={this.state.conversations}
            ListHeaderComponent={() => (
              <Text style={styles.headingText}>Direct Messages</Text>
            )}
          />
        </ScrollView>

        <TouchableOpacity onPress={() => this.props.navigation.push('Conversation')} style={styles.newButton}>
          <EditIcon width={25} height={25} style={styles.newButtonIcon} />

          <LinearGradient
            useAngle
            angle={36}
            colors={[ '#299BCB', '#1ACCB4' ]}
            style={styles.newButtonBackground}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: 26,
    marginTop: 40,
  },
  newButton: {
    alignItems: 'center',
    borderRadius: 30,
    bottom: 25,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 30,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    width: 60,
  },
  newButtonBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    zIndex: -1,
  },
  newButtonIcon: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});
