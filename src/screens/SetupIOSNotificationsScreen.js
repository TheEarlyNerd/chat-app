import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BabbleButton, BabbleTiledIconsBackground } from '../components';
import { BellIcon, SmileIcon } from '../components/icons';
import maestro from '../maestro';

const { userManager, notificationsManager } = maestro.managers;

export default class SetupIOSNotificationsScreen extends Component {
  state = {
    failed: !notificationsManager.permissionsEnabled() && notificationsManager.permissionsRequested(),
    loading: false,
  }

  componentDidMount() {
    maestro.link(this);
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  async receiveEvent(name, value) {
    if (name === 'NOTIFICATIONS:PROMPT_COMPLETE') {
      this._next();
    }

    if (name === 'APP_STATE_CHANGED' && value === 'active') {
      await notificationsManager.checkAndSyncPermissions();

      if (notificationsManager.permissionsEnabled()) {
        this._next();
      } else {
        this.setState({ loading: false });
      }
    }
  }

  _enableNotifications = () => {
    if (!this.state.failed) {
      notificationsManager.requestPermissions();
    } else {
      this.setState({ loading: true });
      Linking.openURL('app-settings:');
    }
  }

  _next = () => {
    notificationsManager.deferPermissions();
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

          <FastImage
            resizeMode={'contain'}
            source={require('../assets/images/enableNotificationsBackground.png')}
            style={styles.backgroundImage}
          />
        </View>

        <View style={styles.formContainer}>
          <BabbleButton loading={this.state.loading} onPress={this._enableNotifications}>
            {(!this.state.failed) ? 'Enable Notifications' : 'Open Settings'}
          </BabbleButton>

          <TouchableOpacity onPress={this._next} style={styles.notNowButton}>
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
  backgroundImage: {
    aspectRatio: 0.6855,
    bottom: 0,
    position: 'absolute',
    width: '100%',
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
