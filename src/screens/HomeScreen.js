import React, { Component } from 'react';
import { BabbleFeed, BabbleHomeOnboardingView, BabbleHomeEmptyView } from '../components';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;
const { roomsManager } = maestro.managers;

export default class HomeScreen extends Component {
  static contextType = NavigationTypeContext;

  state = {
    rooms: null,
    canLoadMore: true,
  }

  componentDidMount() {
    maestro.link(this);

    this._loadRooms();
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ rooms }) {
    this.setState({ rooms: rooms.recentRooms });
  }

  receiveEvent(name, value) {
    if (name === 'APP_STATE_CHANGED' && value === 'active') {
      this._loadRooms();
    }
  }

  _loadRooms = async () => {
    await roomsManager.loadRecentRooms({ limit: 15 });

    this.setState({ canLoadMore: true });
  }

  _loadMore = async () => {
    const { rooms } = this.state;

    if (!rooms?.length) {
      return;
    }

    const result = await roomsManager.loadRecentRooms({
      staler: rooms[rooms.length - 1].lastMessageAt,
    });

    this.setState({ canLoadMore: !!result.length });
  }

  _generateData = () => {
    const { rooms } = this.state;

    const mapItems = (items, type) => items.map((item, index) => {
      if (index === items.length - 1) {
        item.last = true;
      }

      if (type) {
        item[type] = true;
      }

      return item;
    });

    return [
      ...((!!rooms && rooms.length) ? [
        ...mapItems(rooms, 'roomPreview'),
      ] : []),

      ...((!rooms) ? [
        { id: 'loading', loading: true, last: true },
      ] : []),
    ];
  }

  render() {
    if (this.state.rooms?.length === 0) {
      return ([ 'xs', 'sm', 'md' ].includes(interfaceHelper.screenBreakpoint())) ? (
        <BabbleHomeOnboardingView />
      ) : (
        <BabbleHomeEmptyView />
      );
    }

    return (
      <BabbleFeed
        onEndReached={this._loadMore}
        onRefresh={this._loadRooms}
        generateData={this._generateData}
        canLoadMore={this.state.canLoadMore}
      />
    );
  }
}
