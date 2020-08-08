import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleConversationPreview } from './';

export default class BabbleConversationPreviewsList extends Component {
  state = {
    lazyLoading: false,
    refreshing: false,
  }

  _endReached = async () => {
    const { conversations, loadConversations } = this.props;
    const { lazyLoading } = this.state;

    if (lazyLoading || lazyLoading === null || !conversations) {
      return;
    }

    this.setState({ lazyLoading: true });

    const loadedConversations = await loadConversations();

    this.setState({ lazyLoading: (loadedConversations.length) ? false : null });
  }

  _refresh = async () => {
    this.setState({ refreshing: true });

    await this.props.loadConversations(true);

    this.setState({
      lazyLoading: false,
      refreshing: false,
    });
  }

  _renderConversationPreview = ({ item, index }) => {
    return (
      <BabbleConversationPreview conversation={item} />
    );
  }

  _renderLoading = () => {
    return (
      <ActivityIndicator size={'large'} />
    );
  }

  render() {
    const { conversations, style, ...props } = this.props;
    const { refreshing, lazyLoading } = this.state;

    return (
      <FlatList
        data={conversations}
        renderItem={this._renderConversationPreview}
        keyExtractor={item => `${item.id}`}
        style={[ styles.container, style ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={(lazyLoading) ? this._renderLoading : null}
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
  separator: {
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 0.5,
    marginBottom: 15,
    paddingTop: 15,
  },
});
