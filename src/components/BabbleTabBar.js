import React, { Component } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { HomeIcon, CompassIcon, PlusIcon } from './icons';
import maestro from '../maestro';

const { navigationHelper, interfaceHelper } = maestro.helpers;

export default class BabbleTabBar extends Component {
  state = {
    showBrowseRoomsIcon: true,
    hasUnreadMessage: false,
  }

  componentDidMount() {
    maestro.link(this);
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { showBrowseRoomsIcon } = this.state;

    if (nextProps.state.index === 1 && showBrowseRoomsIcon) {
      this.setState({ showBrowseRoomsIcon: false });
      return false;
    }

    return true;
  }

  receiveStoreUpdate({ rooms }) {
    const { recentRooms } = rooms;
    let hasUnreadMessage = false;

    if (Array.isArray(recentRooms)) {
      recentRooms.forEach(room => {
        const { authUserRoomData, previewRoomMessage } = room;

        hasUnreadMessage = !authUserRoomData || authUserRoomData.lastReadAt < previewRoomMessage.createdAt || hasUnreadMessage;
      });
    }

    this.setState({ hasUnreadMessage });
  }

  _openHome = () => {
    navigationHelper.navigate(this.props.state.routes[0].name, null, 'sidebar');
  }

  _openNewRoom = () => {
    if ([ 'xs', 'sm', 'md' ].includes(interfaceHelper.screenBreakpoint())) {
      navigationHelper.navigate('NewRoomNavigator');
    } else {
      navigationHelper.reset('Room', { backEnabled: false }, 'content');
    }
  }

  _openBrowseRooms = () => {
    navigationHelper.navigate(this.props.state.routes[1].name, null, 'sidebar');
  }

  render() {
    const { hasUnreadMessage, showBrowseRoomsIcon } = this.state;
    const { index } = this.props.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={this._openHome} style={styles.tabBarButton}>
            <View style={styles.tabBarButtonIconContainer}>
              <HomeIcon
                width={interfaceHelper.deviceValue({ default: 26, lg: 30 })}
                height={interfaceHelper.deviceValue({ default: 26, lg: 30 })}
                style={[
                  styles.tabBarIcon,
                  (index === 0) ? styles.activeColor : null,
                ]}
              />

              <Text
                style={[
                  styles.labelText,
                  (index === 0) ? styles.activeColor : null,
                ]}
              >
                My Rooms
              </Text>

              {hasUnreadMessage && (
                <View style={styles.alertIcon} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this._openNewRoom}
            style={styles.tabBarComposeButton}
          >
            <PlusIcon
              width={interfaceHelper.deviceValue({ default: 26, lg: 36 })}
              height={interfaceHelper.deviceValue({ default: 26, lg: 36 })}
              style={{ color: '#FFF' }}
            />

            <LinearGradient
              useAngle
              angle={36}
              colors={[ '#299BCB', '#1ACCB4' ]}
              style={styles.backgroundGradient}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this._openBrowseRooms} style={styles.tabBarButton}>
            <View style={styles.tabBarButtonIconContainer}>
              <CompassIcon
                width={interfaceHelper.deviceValue({ default: 26, lg: 36 })}
                height={interfaceHelper.deviceValue({ default: 26, lg: 36 })}
                style={[
                  styles.tabBarIcon,
                  (index === 1) ? styles.secondActiveColor : null,
                ]}
              />

              <Text
                style={[
                  styles.labelText,
                  (index === 1) ? styles.secondActiveColor : null,
                ]}
              >
                Browse Rooms
              </Text>

              {showBrowseRoomsIcon && (
                <View style={styles.alertIcon} />
              )}
            </View>

          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  activeColor: {
    color: '#2A99CC',
  },
  alertIcon: {
    backgroundColor: '#FF0000',
    borderColor: '#FFFFFF',
    borderRadius: interfaceHelper.deviceValue({ default: 6, lg: 8 }),
    borderWidth: 2,
    height: interfaceHelper.deviceValue({ default: 12, lg: 15 }),
    position: 'absolute',
    right: interfaceHelper.deviceValue({ default: 35, lg: 55 }),
    top: interfaceHelper.deviceValue({ default: 3, lg: 1 }),
    width: interfaceHelper.deviceValue({ default: 12, lg: 15 }),
    zIndex: 1,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: interfaceHelper.deviceValue({ default: 25, lg: 35 }),
    zIndex: -1,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  labelText: {
    color: '#979797',
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 11, lg: 15 }),
  },
  secondActiveColor: {
    color: '#1ACCB4',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    height: interfaceHelper.deviceValue({ default: 50, lg: 65 }),
    paddingTop: interfaceHelper.deviceValue({ default: 0, lg: 5 }),
    justifyContent: 'space-around',
  },
  tabBarButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabBarButtonIconContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: interfaceHelper.deviceValue({ default: 100, lg: 150 }),
  },
  tabBarComposeButton: {
    alignItems: 'center',
    borderRadius: interfaceHelper.deviceValue({ default: 25, lg: 35 }),
    height: interfaceHelper.deviceValue({ default: 45, lg: 55 }),
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    top: interfaceHelper.deviceValue({ default: -10, lg: -15 }),
    width: interfaceHelper.deviceValue({ default: 45, lg: 55 }),
  },
  tabBarIcon: {
    color: '#979797',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
  },
});
