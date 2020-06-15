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
    search: null,
    exploreConversations: null,
    feedConversations: null,
    privateConversations: null,
    recentConversations: null,
  }

  searchTextInputTimeout = null;

  componentDidMount() {
    maestro.link(this);

    conversationsManager.loadExploreConversations();
    conversationsManager.loadFeedConversations();
    conversationsManager.loadPrivateConversations();
    conversationsManager.loadRecentConversations();
  }

  componentWillUnmount() {
    maestro.unlink(this);

    clearTimeout(this.searchTextInputTimeout);
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

  _generateData = () => {
    const { search, exploreConversations, feedConversations, privateConversations, recentConversations } = this.state;

    if (search) {
      return [
        { id: 'search', search: true },
      ];
    }

    return [
      { id: 'search', search: true },

      ...((!!recentConversations && recentConversations.length) ? [
        { id: 'recentConversations', title: 'Recent Conversations', type: 'recent', header: true },
        ...(recentConversations.map((conversation, index) => {
          if (index === recentConversations.length - 1) {
            conversation.last = true;
          }

          return conversation;
        })),
        ...((recentConversations.length >= 5) ? [ { viewMore: true, title: 'Recent Conversations', type: 'recent' } ] : []),
      ] : []),

      ...((!!privateConversations && privateConversations.length) ? [
        { id: 'directMessages', title: 'Direct Messages', type: 'private', header: true },
        ...(privateConversations.map((conversation, index) => {
          if (index === privateConversations.length - 1) {
            conversation.last = true;
          }

          return conversation;
        })),
        ...((privateConversations.length >= 5) ? [ { viewMore: true, title: 'Direct Messages', type: 'private' } ] : []),
      ] : []),

      ...((!!feedConversations && feedConversations.length) ? [
        { id: 'feed', title: 'Feed', type: 'feed', header: true },
        ...(feedConversations.map((conversation, index) => {
          if (index === feedConversations.length - 1) {
            conversation.last = true;
          }

          return conversation;
        })),
        ...((feedConversations.length >= 5) ? [ { viewMore: true, title: 'Feed', type: 'feed' } ] : []),
      ] : []),

      ...((!!exploreConversations && exploreConversations.length) ? [
        { id: 'explore', title: 'Explore', type: 'explore', header: true },
        ...(exploreConversations.map((conversation, index) => {
          if (index === exploreConversations.length - 1) {
            conversation.last = true;
          }

          return conversation;
        })),
        { viewMore: true, title: 'Explore', type: 'explore' },
      ] : []),
    ];
  }

  _onSearchChangeText = text => {


    this.setState({ search: text });
  }

  _renderHeader = ({ title, type }) => {
    return (
      <TouchableOpacity
        onPress={() => this._openConversationsList({ title, type })}
        style={styles.headerButton}
      >
        <Text style={styles.headerText}>{title}</Text>
        <ChevronRightIcon width={32} height={32} style={styles.headerIcon} />
      </TouchableOpacity>
    );
  }

  _renderSearch = () => {
    return (
      <BabbleSearchField
        onChangeText={this._onSearchChangeText}
        placeholder={'Search users and conversations...'}
        containerStyle={styles.searchField}
      />
    );
  }

  _renderViewMore = ({ title, type }) => {
    return (
      <TouchableOpacity
        onPress={() => this._openConversationsList({ title, type })}
        style={styles.viewMoreButton}
      >
        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>
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

    if (item.viewMore) {
      return this._renderViewMore(item);
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

    if (!leadingItem.header && !leadingItem.viewMore && !leadingItem.search) {
      return <View style={styles.separator} />;
    }

    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this._generateData()}
          contentContainerStyle={styles.contentContainer}
          renderItem={this._renderItem}
          keyboardShouldPersistTaps={'handled'}
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
    paddingBottom: 25,
    paddingTop: 40,
  },
  conversationPreview: {
    paddingHorizontal: 15,
  },
  headerButton: {
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
  viewMoreButton: {
    alignSelf: 'center',
    borderColor: '#E8E8E8',
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 35,
    marginTop: -15,
    paddingHorizontal: 10,
    paddingVertical: 5,

  },
  viewMoreText: {
    alignSelf: 'center',
    color: '#9B9B9B',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
});
