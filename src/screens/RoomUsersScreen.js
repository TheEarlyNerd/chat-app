import React, { Component } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleUserPreview } from '../components';
import maestro from '../maestro';

const { roomsManager } = maestro.managers;

export default class RoomUsersScreen extends Component {
  state = {
    roomUsers: null,
  }

  async componentDidMount() {
    const { roomId } = this.props.route.params;
    const roomUsers = await roomsManager.getRoomUsers(roomId);

    this.setState({ roomUsers });
  }

  _renderItem = ({ item, index }) => {
    return (
      <BabbleUserPreview
        user={item.user}
        style={styles.user}
      />
    );
  }

  _renderFooter = () => {
    const { roomUsers } = this.state;

    if (roomUsers) {
      return null;
    }

    return (
      <ActivityIndicator size={'large'} />
    );
  }

  render() {
    const { roomUsers } = this.state;

    return (
      <FlatList
        data={roomUsers}
        renderItem={this._renderItem}
        keyExtractor={(item, index) => `${item.id}.${index}`}
        ListFooterComponent={this._renderFooter}
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
    paddingTop: 20,
  },
  user: {
    marginBottom: 20,
  },
});
