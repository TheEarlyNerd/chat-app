import React, { Component } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { HomeIcon, CompassIcon, PlusIcon } from './icons';
import maestro from '../maestro';

const { navigationHelper } = maestro.helpers;

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

    recentRooms.forEach(room => {
      const { authUserRoomData, previewRoomMessage } = room;

      hasUnreadMessage = authUserRoomData.lastReadAt < previewRoomMessage.createdAt || hasUnreadMessage;
    });

    this.setState({ hasUnreadMessage });
  }

  render() {
    const { hasUnreadMessage, showBrowseRoomsIcon } = this.state;
    const { routes, index } = this.props.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => navigationHelper.navigate(routes[0].name)} style={styles.tabBarButton}>
            <View style={styles.tabBarButtonIconContainer}>
              <HomeIcon
                width={26}
                height={26}
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

          <TouchableOpacity onPress={() => navigationHelper.navigate('NewRoomNavigator')} style={styles.tabBarComposeButton}>
            <PlusIcon width={26} height={26} style={{ color: '#FFF' }} />

            <LinearGradient
              useAngle
              angle={36}
              colors={[ '#299BCB', '#1ACCB4' ]}
              style={styles.backgroundGradient}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigationHelper.navigate(routes[1].name)} style={styles.tabBarButton}>
            <View style={styles.tabBarButtonIconContainer}>
              <CompassIcon
                width={26}
                height={26}
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
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
    zIndex: 1,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
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
    fontSize: 11,
  },
  secondActiveColor: {
    color: '#1ACCB4',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  tabBarButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabBarButtonIconContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabBarComposeButton: {
    alignItems: 'center',
    borderRadius: 25,
    height: 45,
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    top: -20,
    width: 45,
  },
  tabBarIcon: {
    color: '#979797',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
  },
});
