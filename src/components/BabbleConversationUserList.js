import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleUserAvatar } from './';

export default class BabbleConversationUserList extends Component {
  _renderUser = ({ item, index }) => {
    const { onPress } = this.props;

    return (
      <TouchableOpacity onPress={() => onPress(item)} style={styles.user}>
        <BabbleUserAvatar
          avatarAttachment={item.avatarAttachment}
          lastActiveAt={item.lastActiveAt}
          disabled
          size={40}
        />

        <View style={styles.details}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.usernameText}>@{item.username}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderNoResultsMessage = () => {
    return (
      <Text style={styles.emptyText}>
        {this.props.noResultsMessage || 'No results found'}
      </Text>
    );
  }

  _renderLoading = () => {
    return (
      <ActivityIndicator size={'large'} />
    );
  }

  render() {
    const { users, onPress, loading, disableNoResultsMessage, style, ...props } = this.props;

    return (
      <FlatList
        data={users}
        renderItem={this._renderUser}
        keyExtractor={item => `${item.id}`}
        style={[ styles.container, style ]}
        ListEmptyComponent={(!loading && !disableNoResultsMessage) ? this._renderNoResultsMessage : null}
        ListFooterComponent={(loading) ? this._renderLoading : null}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
  },
  details: {
    marginLeft: 15,
  },
  emptyText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
  },
  nameText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
  user: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
  },
  usernameText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
  },
});
