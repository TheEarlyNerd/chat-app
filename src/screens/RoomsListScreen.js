import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleRoomPreviewsList } from '../components';
import maestro from '../maestro';

const { roomsManager } = maestro.managers;

export default class CovnersationsListScreen extends Component {
  state = {
    rooms: null,
  }

  componentDidMount() {
    maestro.link(this);

    this._loadRooms();
  }

  receiveStoreUpdate({ rooms }) {
    const params = this.props.route.params || {};
    const { type } = params;

    if (type === 'recent') {
      this.setState({ rooms: rooms.recentRooms });
    }

    if (type === 'private') {
      this.setState({ rooms: rooms.privateRooms });
    }

    if (type === 'feed') {
      this.setState({ rooms: rooms.feedRooms });
    }

    if (type === 'explore') {
      this.setState({ rooms: rooms.exploreRooms });
    }
  }

  _loadRooms = async refresh => {
    const params = this.props.route.params || {};
    const { type } = params;
    const { rooms } = this.state;
    const queryParams = { limit: 15 };

    if (rooms?.length && !refresh && type === 'feed') {
      queryParams.before = rooms[rooms.length - 1].createdAt;
    }

    if (rooms?.length && !refresh && [ 'recent', 'private', 'explore' ].includes(type)) {
      queryParams.staler = rooms[rooms.length - 1].lastMessageAt;
    }

    if (type === 'recent') {
      return roomsManager.loadRecentRooms(queryParams);
    }

    if (type === 'private') {
      return roomsManager.loadPrivateRooms(queryParams);
    }

    if (type === 'feed') {
      return roomsManager.loadFeedRooms(queryParams);
    }

    if (type === 'explore') {
      return roomsManager.loadExploreRooms(queryParams);
    }
  }

  _renderEmpty = () => {
    const { rooms } = this.state;

    if (rooms) {
      return null;
    }

    return (
      <ActivityIndicator size={'large'} />
    );
  }

  render() {
    const { rooms } = this.state;

    return (
      <BabbleRoomPreviewsList
        rooms={rooms}
        loadRooms={this._loadRooms}
        ListEmptyComponent={this._renderEmpty}
        contentContainerStyle={styles.contentContainer}
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
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});
