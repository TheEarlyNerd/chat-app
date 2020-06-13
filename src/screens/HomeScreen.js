import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BabbleConversationPreview, BabbleSearchField } from '../components';
import { ChevronRightIcon, EditIcon } from '../components/icons';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;
const { navigationHelper } = maestro.helpers;

export default class HomeScreen extends Component {
  state = {
    exploreConversations: null,
    feedConversations: null,
    privateConversations: null,
    recentConversations: null,
  }

  componentDidMount() {
    maestro.link(this);

    conversationsManager.loadExploreConversations();
    conversationsManager.loadFeedConversations();
    conversationsManager.loadPrivateConversations();
    conversationsManager.loadRecentConversations();
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ conversations, user }) {
    this.setState({
      exploreConversations: conversations.exploreConversations,
      feedConversations: conversations.feedConversations,
      privateConversations: conversations.privateConversations,
      recentConversations: conversations.recentConversations,
    });
  }

  _openConversationsList = ({ title, type }) => {
    navigationHelper.push('ConversationsList', { title, type });
  }

  _renderHeader = ({ title, type }) => {
    return (
      <TouchableOpacity
        onPress={() => this._openConversationsList({ title, type })}
        style={styles.header}
      >
        <Text style={styles.headerText}>{title}</Text>
        <ChevronRightIcon width={32} height={32} style={styles.headerIcon} />
      </TouchableOpacity>
    );
  }

  _renderSearch = () => {
    return (
      <BabbleSearchField
        placeholder={'Search users and conversations...'}
        containerStyle={styles.searchField}
      />
    );
  }

  _renderConversationPreview = conversation => {
    return (
      <BabbleConversationPreview
        conversation={conversation}
        style={styles.conversationPreview}
      />
    );
  }

  _renderItem = ({ item, index }) => {
    if (item.search) {
      return this._renderSearch();
    }

    if (item.header) {
      return this._renderHeader(item);
    }

    return this._renderConversationPreview(item);
  }

  _renderItemSeparator = ({ leadingItem }) => {
    if (leadingItem.last) {
      return <View style={styles.spacer} />;
    }

    if (!leadingItem.header && !leadingItem.search) {
      return <View style={styles.separator} />;
    }

    return null;
  }

  render() {
    const { exploreConversations, feedConversations, privateConversations, recentConversations } = this.state;
    const data = [
      { id: 'search', search: true },

      ...((!!recentConversations && recentConversations.length) ? [
        { id: 'recentConversations', title: 'Recent Conversations', type: 'recent', header: true },
        ...(recentConversations.map((conversation, index) => {
          if (index === recentConversations.length - 1) {
            conversation.last = true;
          }

          return conversation;
        })),
      ] : []),

      ...((!!privateConversations && privateConversations.length) ? [
        { id: 'directMessages', title: 'Direct Messages', type: 'private', header: true },
        ...(privateConversations.map((conversation, index) => {
          if (index === privateConversations.length - 1) {
            conversation.last = true;
          }

          return conversation;
        })),
      ] : []),

      ...((!!feedConversations && feedConversations.length) ? [
        { id: 'feed', title: 'Feed', type: 'feed', header: true },
        ...(feedConversations.map((conversation, index) => {
          if (index === feedConversations.length - 1) {
            conversation.last = true;
          }

          return conversation;
        })),
      ] : []),

      ...((!!exploreConversations && exploreConversations.length) ? [
        { id: 'explore', title: 'Explore', type: 'explore', header: true },
        ...(exploreConversations.map((conversation, index) => {
          if (index === exploreConversations.length - 1) {
            conversation.last = true;
          }

          return conversation;
        })),
      ] : []),
    ];

    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          contentContainerStyle={styles.contentContainer}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => `${item.id}.${index}`}
          ItemSeparatorComponent={this._renderItemSeparator}
          style={styles.container}
        />

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
  contentContainer: {
    paddingBottom: 100,
    paddingTop: 40,
  },
  conversationPreview: {
    paddingHorizontal: 15,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    width: '100%',
  },
  headerIcon: {
    color: '#404040',
  },
  headerText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: 26,
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
  searchField: {
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  separator: {
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 0.5,
    marginBottom: 15,
    marginHorizontal: 15,
    paddingTop: 15,
  },
  spacer: {
    height: 40,
  },
});
