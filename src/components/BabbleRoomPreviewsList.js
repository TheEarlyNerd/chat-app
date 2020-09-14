import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleRoomPreview } from './';

export default class BabbleRoomPreviewsList extends Component {
  state = {
    lazyLoading: false,
    refreshing: false,
  }

  _endReached = async () => {
    const { rooms, loadRooms } = this.props;
    const { lazyLoading } = this.state;

    if (lazyLoading || lazyLoading === null || !rooms) {
      return;
    }

    this.setState({ lazyLoading: true });

    const loadedRooms = await loadRooms();

    this.setState({ lazyLoading: (loadedRooms.length) ? false : null });
  }

  _refresh = async () => {
    this.setState({ refreshing: true });

    await this.props.loadRooms(true);

    this.setState({
      lazyLoading: false,
      refreshing: false,
    });
  }

  _renderRoomPreview = ({ item, index }) => {
    return (
      <BabbleRoomPreview room={item} />
    );
  }

  _renderLoading = () => {
    return (
      <ActivityIndicator size={'large'} />
    );
  }

  render() {
    const { rooms, style, ...props } = this.props;
    const { refreshing, lazyLoading } = this.state;

    return (
      <FlatList
        data={rooms}
        renderItem={this._renderRoomPreview}
        keyExtractor={item => `${item.id}`}
        style={[ styles.container, style ]}
        ListFooterComponent={(lazyLoading) ? this._renderLoading : null}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={this._refresh}
        onEndReached={this._endReached}
        onEndReachedThreshold={0.25}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
