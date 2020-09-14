import React, { Component } from 'react';
import { BabbleFeed } from '../components';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { roomsManager, userManager } = maestro.managers;

export default class ExploreScreen extends Component {
  static contextType = NavigationTypeContext;

  state = {
    rooms: null,
    search: null,
    searchUsers: null,
    searchRooms: null,
    loadingSearch: false,
    canLoadMore: true,
  }

  searchTextInputTimeout = null;

  componentDidMount() {
    maestro.link(this);

    this._loadRooms();
  }

  componentWillUnmount() {
    maestro.unlink(this);

    clearTimeout(this.searchTextInputTimeout);
  }

  receiveStoreUpdate({ rooms }) {
    this.setState({ rooms: rooms.exploreRooms });
  }

  receiveEvent(name, value) {
    if (name === 'APP_STATE_CHANGED' && value === 'active') {
      this._loadRooms();
    }
  }

  _loadRooms = async () => {
    await roomsManager.loadExploreRooms();
  }

  _loadMore = async () => {
    const { rooms } = this.state;

    if (!rooms?.length) {
      return;
    }

    const result = await roomsManager.loadExploreRooms({
      staler: rooms[rooms.length - 1].lastMessageAt,
    });

    this.setState({ canLoadMore: !!result.length });
  }

  _generateData = () => {
    const {
      rooms,
      search,
      searchUsers,
      searchRooms,
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

        { id: 'searchRooms', title: 'Rooms', header: true },
        ...((!!searchRooms && !loadingSearch && searchRooms.length) ? [
          ...mapItems(searchRooms, 'roomPreview'),
        ] : [
          (!loadingSearch)
            ? { id: 'searchRoomsNoResults', last: true, noResults: true }
            : { id: 'searchRoomsLoading', last: true, loading: true },
        ]),
      ];
    }

    return [
      { id: 'search', search: true },
      { id: 'discover', title: 'Popular Rooms', header: true },

      ...((!!rooms && rooms.length) ? [
        ...mapItems(rooms, 'roomPreview'),
      ] : []),

      ...((!rooms) ? [
        { id: 'loading', loading: true, last: true },
      ] : []),
    ];
  }

  _onSearchChange = async text => {
    this.setState({ search: text });

    clearTimeout(this.searchTextInputTimeout);

    if (!text) {
      return this.setState({ canLoadMore: true });
    } else {
      this.setState({ loadingSearch: true, canLoadMore: false });
    }

    this.searchTextInputTimeout = setTimeout(async () => {
      const searchUsers = await userManager.searchUsers(text);
      const searchRooms = await roomsManager.searchRooms(text);

      this.setState({
        search: text,
        searchUsers,
        searchRooms,
        loadingSearch: false,
      });
    }, 500);
  }

  render() {
    return (
      <BabbleFeed
        onEndReached={this._loadMore}
        onRefresh={this._loadRooms}
        onSearchChange={this._onSearchChange}
        generateData={this._generateData}
        canLoadMore={this.state.canLoadMore}
      />
    );
  }
}
