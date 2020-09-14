import React, { Component } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleRoomPreview, BabbleUserPreview, BabbleSearchField, BabbleViewMoreButton } from '../components';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { ChevronRightIcon } from '../components/icons';

export default class BabbleFeed extends Component {
  state = {
    lazyLoading: false,
    refreshing: false,
  }

  _refresh = async () => {
    this.setState({ refreshing: true });

    await this.props.onRefresh();

    this.setState({ lazyLoading: false, refreshing: false });
  }

  _endReached = async () => {
    const { onEndReached, canLoadMore } = this.props;
    const { lazyLoading } = this.state;

    if (!onEndReached || lazyLoading || !canLoadMore) {
      return;
    }

    this.setState({ lazyLoading: true });

    await onEndReached();

    this.setState({ lazyLoading: false });
  }

  _renderHeader = ({ title, type }) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.onHeaderPress({ title, type })}
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
        onChangeText={this.props.onSearchChange}
        placeholder={'Search users and rooms...'}
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
        onPress={() => this.props.onViewMorePress({ title, type })}
        style={styles.viewMoreButton}
      />
    );
  }

  _renderRoomPreview = room => {
    return (
      <BabbleRoomPreview
        room={room}
        style={styles.roomPreview}
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

    if (item.roomPreview) {
      return this._renderRoomPreview(item);
    }

    if (item.userPreview) {
      return this._renderUserPreview(item);
    }
  }

  _renderNoResults = () => {
    return (
      <Text style={styles.noResultsText}>No results found</Text>
    );
  }

  render() {
    const { refreshing, lazyLoading } = this.state;

    return (
      <KeyboardAwareFlatList
        data={this.props.generateData()}
        contentContainerStyle={styles.contentContainer}
        renderItem={this._renderItem}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={(item, index) => `${item.id}.${index}`}
        ListFooterComponent={(lazyLoading) ? this._renderLoading : null}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={this._refresh}
        onEndReached={this._endReached}
        onEndReachedThreshold={0.25}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 25,
    paddingTop: 10,
  },
  roomPreview: {
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
    fontSize: 32,
  },
  noResultsText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },
  searchField: {
    marginVertical: 30,
    paddingHorizontal: 15,
  },
  userPreview: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  viewMoreButton: {
    marginTop: -15,
  },
});
