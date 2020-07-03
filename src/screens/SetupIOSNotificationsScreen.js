import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { BabbleButton, BabbleTiledIconsBackground } from '../components';
import { BellIcon, SmileIcon } from '../components/icons';
import maestro from '../maestro';

const { userManager, notificationsManager } = maestro.managers;

export default class SetupIOSNotificationsScreen extends Component {
  state = {
    failed: false,
  }

  componentDidMount() {
    maestro.link(this);
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveEvent(name, value) {
    if (name === 'NOTIFICATIONS:REGISTERED') {
      this.props.navigation.navigate(userManager.nextRouteNameForUserState());
    }
  }

  _enableNotifications = () => {
    if (!this.state.failed) {
      notificationsManager.requestIOSPermissions();
    } else {
      Linking.openURL('app-settings:');
    }
  }

  _notNow = () => {
    notificationsManager.deferIOSPermissions();
    this.props.navigation.navigate(userManager.nextRouteNameForUserState());
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <BabbleTiledIconsBackground
            iconComponents={[ BellIcon, SmileIcon ]}
            iconSize={20}
            iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
            iconSpacing={37}
            linearGradientProps={{
              colors: [ '#299BCB', '#1ACCB4' ],
              locations: [ 0, 0.7 ],
              useAngle: true,
              angle: 36,
            }}
            style={styles.backgroundGradient}
          />
        </View>

        <View style={styles.formContainer}>
          <BabbleButton onPress={this._enableNotifications}>
            {(!this.state.failed) ? 'Enable Notifications' : 'Open Settings'}
          </BabbleButton>

          <TouchableOpacity onPress={this._notNow} style={styles.notNowButton}>
            <Text style={styles.notNowButtonText}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: 'center',
    flex: 3,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  notNowButton: {
    marginTop: 10,
    padding: 10,
  },
  notNowButtonText: {
    color: '#666666',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 18,
  },
});
