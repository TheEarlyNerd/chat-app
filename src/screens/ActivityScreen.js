import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { BabbleActivity } from '../components';

import maestro from '../maestro';

const { activityManager } = maestro.managers;

export default class ActivityScreen extends Component {
  state = {
    activity: null,
    refreshing: false,
  }

  componentDidMount() {
    this._loadActivity();
  }

  _loadActivity = async () => {
    const activity = await activityManager.loadActivity(true);

    this.setState({ activity });
  }

  _refresh = async () => {
    this.setState({ refreshing: true });

    await this._loadActivity();

    this.setState({ refreshing: false });
  }

  _renderActivity = ({ item, index }) => {
    return (
      <BabbleActivity activity={item} />
    );
  }

  _renderNoActivity = () => {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noActivityText}>When someone follows you, reposts your rooms, or tags you in a message, we'll let you know here.</Text>
      </View>
    );
  }

  _renderLoading = () => {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  render() {
    const { activity, refreshing } = this.state;

    if (!activity) {
      return this._renderLoading();
    }

    if (!activity.length) {
      return this._renderNoActivity();
    }

    return (
      <FlatList
        data={activity}
        renderItem={this._renderActivity}
        keyExtractor={item => `${item.id}`}
        refreshing={refreshing}
        onRefresh={this._refresh}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  centeredContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  noActivityText: {
    color: '#4F4F4F',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 17,
    textAlign: 'center',
  },
});
