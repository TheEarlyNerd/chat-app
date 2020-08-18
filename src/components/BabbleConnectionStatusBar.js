import React, { Component } from 'react';
import { View, Text, ActivityIndicator, LayoutAnimation, StyleSheet } from 'react-native';
import maestro from '../maestro';

const { appManager, eventsManager } = maestro.managers;

export default class BabbleConnectionStatusBar extends Component {
  state = {
    eventsConnected: eventsManager.store.connected,
    networkConnected: !!appManager.store.networkState && appManager.store.networkState.isConnected,
  }

  componentDidMount() {
    maestro.link(this);
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveEvent(name, value) {
    if ([ 'EVENTS_CONNECTED', 'APP_NETWORK_STATE_CHANGED' ].includes(name)) {
      if (name === 'EVENTS_CONNECTED') {
        this.setState({ eventsConnected: value });
      }

      if (name === 'APP_NETWORK_STATE_CHANGED') {
        this.setState({ networkConnected: value.isConnected });
      }

    }
  }

  render() {
    const { style } = this.props;
    const { eventsConnected, networkConnected } = this.state;

    if (eventsConnected && networkConnected) {
      return <View />;
    }

    return (
      <View style={[ styles.container, style ]}>
        <ActivityIndicator color={'#FFFFFF'} style={styles.activityIndicator} />

        <Text style={styles.text}>Connection Lost, Reconnecting...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    marginRight: 8,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#F54444',
    flexDirection: 'row',
    height: 36,
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 15,
  },
});
