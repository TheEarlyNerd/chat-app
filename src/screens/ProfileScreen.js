import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleRoomPreviewsList, BabbleProfileHeader } from '../components';
import maestro from '../maestro';

const { userManager, roomsManager } = maestro.managers;

export default class ProfileScreen extends Component {
  state = {
    user: null,
    rooms: null,
    refreshing: false,
  }

  async componentDidMount() {
    maestro.link(this);

    const params = this.props.route.params || {};
    const { userId } = params;
    const user = await userManager.getUser(userId);

    this.setState({ user });

    this.props.navigation.setOptions({ title: (user.username) ? `@${user.username}` : 'Invited User' });

    this._loadRooms();
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ rooms, user }) {
    if (!this.state.user) {
      return;
    }

    const state = { rooms: rooms.usersRooms[this.state.user.id] };

    if (this.state.user.id === user.user.id) {
      state.user = user.user;
    }

    this.setState(state);
  }

  _loadRooms = async refresh => {
    const params = this.props.route.params || {};
    const { userId } = params;
    const { rooms } = this.state;

    return roomsManager.loadUsersRooms({
      userId,
      queryParams: (rooms && !refresh) ? {
        before: rooms[rooms.length - 1].createdAt,
      } : null,
    });
  }

  _renderHeader = () => {
    return (
      <BabbleProfileHeader
        user={this.state.user}
        showEdit={this.state.user.id === userManager.store.user.id}
      />
    );
  }

  _renderNoRooms = () => {
    const { user } = this.state;

    return (
      <View style={styles.noRoomsContainer}>
        <Text style={styles.noRoomsText}>{user.name} hasn't started or shared any rooms.</Text>
      </View>
    );
  }

  _renderFooter = () => {
    return (
      <ActivityIndicator size={'large'} />
    );
  }

  _renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  render() {
    const { user, rooms } = this.state;

    if (!user) {
      return this._renderLoading();
    }

    return (
      <BabbleRoomPreviewsList
        rooms={rooms}
        loadRooms={this._loadRooms}
        ListHeaderComponent={this._renderHeader}
        ListHeaderComponentStyle={styles.header}
        ListFooterComponent={(rooms === null) ? this._renderFooter : null}
        ListFooterComponentStyle={styles.footer}
        ListEmptyComponent={this._renderNoRooms}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  footer: {
    marginTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noRoomsContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
  },
  noRoomsText: {
    color: '#4F4F4F',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
});
