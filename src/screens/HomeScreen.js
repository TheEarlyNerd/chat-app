import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { BabbleConversationPreview, BabbleUserPreview, BabbleSearchField, BabbleViewMoreButton } from '../components';
import { ChevronRightIcon, EditIcon } from '../components/icons';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { conversationsManager, userManager } = maestro.managers;
const { navigationHelper } = maestro.helpers;

export default class HomeScreen extends Component {
  static contextType = NavigationTypeContext;

  state = {
    exploreConversations: null,
    feedConversations: null,
    privateConversations: null,
    recentConversations: null,
    search: null,
    searchUsers: null,
    searchConversations: null,
    lazyLoading: false,
    loadingSearch: false,
    refreshing: false,
  }

  searchTextInputTimeout = null;

  componentDidMount() {
    maestro.link(this);

    this._loadConversations();
  }

  componentWillUnmount() {
    maestro.unlink(this);

    clearTimeout(this.searchTextInputTimeout);
  }

  receiveStoreUpdate({ conversations }) {
    this.setState({
      exploreConversations: conversations.exploreConversations,
      feedConversations: conversations.feedConversations,
      privateConversations: conversations.privateConversations,
      recentConversations: conversations.recentConversations,
    });
  }

  receiveEvent(name, value) {
    if (name === 'APP_STATE_CHANGED' && value === 'active') {
      this._loadConversations();
    }
  }

  _openConversationsList = ({ title, type }) => {
    navigationHelper.push('ConversationsList', { title, type }, 'sidebar');
  }

  _loadConversations = async () => {
    await Promise.all([
      conversationsManager.loadExploreConversations(),
      conversationsManager.loadFeedConversations(),
      conversationsManager.loadPrivateConversations(),
      conversationsManager.loadRecentConversations(),
    ]);
  }

  _generateData = () => {
    const {
      exploreConversations,
      feedConversations,
      privateConversations,
      recentConversations,
      search,
      searchUsers,
      searchConversations,
      loadingSearch,
    } = this.state;

    const mapItems = (items, type) => items.map((item, index) => {
      if (index === items.length - 1) {
        item.last = true;
      }

      if (type) {
        item[type] = true;
      }

      return item;
    });

    if (search) {
      return [
        { id: 'search', search: true },
        { id: 'searchUsers', title: 'Users', header: true },
        ...((!!searchUsers && !loadingSearch && searchUsers.length) ? [
          ...mapItems(searchUsers, 'userPreview'),
        ] : [
          (!loadingSearch)
            ? { id: 'searchUsersNoResults', last: true, noResults: true }
            : { id: 'searchUsersLoading', last: true, loading: true },
        ]),

        { id: 'searchConversations', title: 'Conversations', header: true },
        ...((!!searchConversations && !loadingSearch && searchConversations.length) ? [
          ...mapItems(searchConversations, 'conversationPreview'),
        ] : [
          (!loadingSearch)
            ? { id: 'searchConversationsNoResults', last: true, noResults: true }
            : { id: 'searchConversationsLoading', last: true, loading: true },
        ]),
      ];
    }

    return [
      { id: 'search', search: true },

      ...((!!recentConversations && recentConversations.length) ? [
        { id: 'recentConversations', title: 'Recent Conversations', type: 'recent', header: true },
        ...mapItems(recentConversations.slice(0, 5), 'conversationPreview'),
        ...((recentConversations.length >= 5) ? [ { viewMore: true, title: 'Recent Conversations', type: 'recent' } ] : []),
      ] : []),

      ...((!!privateConversations && privateConversations.length) ? [
        { id: 'directMessages', title: 'Direct Messages', type: 'private', header: true },
        ...mapItems(privateConversations.slice(0, 5), 'conversationPreview'),
        ...((privateConversations.length >= 5) ? [ { viewMore: true, title: 'Direct Messages', type: 'private' } ] : []),
      ] : []),

      ...((!!feedConversations && feedConversations.length) ? [
        { id: 'feed', title: 'Feed', type: 'feed', header: true },
        ...mapItems(feedConversations.slice(0, 5), 'conversationPreview'),
        ...((feedConversations.length >= 5) ? [ { viewMore: true, title: 'Feed', type: 'feed' } ] : []),
      ] : []),

      ...((!!exploreConversations && exploreConversations.length) ? [
        { id: 'explore', title: 'Explore', type: 'explore', header: true },
        ...mapItems(exploreConversations, 'conversationPreview'),
      ] : []),

      ...((!recentConversations && !privateConversations && !feedConversations && !exploreConversations) ? [
        { id: 'loading', loading: true, last: true },
      ] : []),
    ];
  }

  _onSearchChangeText = text => {
    this.setState({ search: text });

    clearTimeout(this.searchTextInputTimeout);

    if (!text) {
      return;
    } else {
      this.setState({ loadingSearch: true });
    }

    this.searchTextInputTimeout = setTimeout(async () => {
      const searchUsers = await userManager.searchUsers(text);
      const searchConversations = await conversationsManager.searchConversations(text);

      this.setState({
        searchUsers,
        searchConversations,
        loadingSearch: false,
      });
    }, 500);
  }

  _refresh = async () => {
    this.setState({ refreshing: true });

    await this._loadConversations();

    this.setState({
      lazyLoading: false,
      refreshing: false,
    });
  }

  _newPress = () => {
    if (this.context === 'sidebar') {
      navigationHelper.reset('Conversation', { backEnabled: false }, 'content');
    } else {
      navigationHelper.navigate('Conversation');
    }
  }

  _endReached = async () => {
    const { exploreConversations, lazyLoading } = this.state;

    if (lazyLoading || lazyLoading === null || !exploreConversations) {
      return;
    }

    this.setState({ lazyLoading: true });

    const loadedConversations = await conversationsManager.loadExploreConversations({
      staler: exploreConversations[exploreConversations.length - 1].lastMessageAt,
    });

    this.setState({ lazyLoading: (loadedConversations.length) ? false : null });
  }

  _renderHeader = ({ title, type }) => {
    return (
      <TouchableOpacity
        onPress={() => this._openConversationsList({ title, type })}
        disabled={!type}
        style={styles.headerButton}
      >
        <Text style={styles.headerText}>{title}</Text>

        {!!type && (
          <ChevronRightIcon width={32} height={32} style={styles.headerIcon} />
        )}
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

  _renderLoading = () => {
    return (
      <ActivityIndicator size={'large'} />
    );
  }

  _renderViewMore = ({ title, type }) => {
    return (
      <BabbleViewMoreButton
        onPress={() => this._openConversationsList({ title, type })}
        style={styles.viewMoreButton}
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

  _renderUserPreview = user => {
    return (
      <BabbleUserPreview
        user={user}
        style={styles.userPreview}
      />
    );
  }

  _renderItem = ({ item, index }) => {
    if (item.search) {
      return this._renderSearch();
    }

    if (item.loading) {
      return this._renderLoading();
    }

    if (item.noResults) {
      return this._renderNoResults();
    }

    if (item.viewMore) {
      return this._renderViewMore(item);
    }

    if (item.header) {
      return this._renderHeader(item);
    }

    if (item.conversationPreview) {
      return this._renderConversationPreview(item);
    }

    if (item.userPreview) {
      return this._renderUserPreview(item);
    }
  }

  _renderItemSeparator = ({ leadingItem }) => {
    if (leadingItem.last) {
      return <View style={styles.spacer} />;
    }

    return null;
  }

  _renderNoResults = () => {
    return (
      <Text style={styles.noResultsText}>No results found</Text>
    );
  }

  render() {
    const { refreshing, lazyLoading } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAwareFlatList
          data={this._generateData()}
          contentContainerStyle={styles.contentContainer}
          renderItem={this._renderItem}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={(item, index) => `${item.id}.${index}`}
          ItemSeparatorComponent={this._renderItemSeparator}
          ListFooterComponent={(lazyLoading) ? this._renderLoading : null}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={this._refresh}
          onEndReached={this._endReached}
          onEndReachedThreshold={0.25}
          style={styles.container}
        />

        <TouchableOpacity onPress={this._newPress} style={styles.newButton}>
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
  noResultsText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },
  searchField: {
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  spacer: {
    height: 40,
  },
  userPreview: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  viewMoreButton: {
    marginTop: -15,
  },
});
