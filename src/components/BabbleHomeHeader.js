import React, { Component } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleTiledIconsBackground, BabbleUserAvatar } from './';
import { BellIcon, MessageSquareIcon, HeartIcon } from './icons';
import maestro from '../maestro';

const { activityManager, userManager } = maestro.managers;

export default class BabbleHeader extends Component {
  state = {
    activity: activityManager.store.activity,
    user: userManager.store.user,
  }

  componentDidMount() {
    maestro.link(this);
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ user }) {
    this.setState({ user: user.user });
  }

  render() {
    const { activity, user } = this.state;
    const { scene } = this.props;
    const { descriptor } = scene;
    const { navigation } = descriptor;
console.log(activity);
console.log(user.lastViewedActivityAt);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerLeft}>
          {!!user && (
            <BabbleUserAvatar
              avatarAttachment={user.avatarAttachment}
              lastActiveAt={new Date() /* TODO: This should be settable by the user, if they're in the app they'll show active to other users right now due to any backend requests setting server side lastActiveAt */}
              size={40}
              imageStyle={styles.userButton}
              onPress={() => {
                navigation.push('ProfileNavigator', {
                  screen: 'Profile',
                  params: { userId: user.id },
                });
              }}
            />
          )}
        </View>

        <View style={styles.headerCenter}>
          <Text style={[ styles.text, styles.babbleLogoText ]}>Babble</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.push('ActivityNavigator')}
            style={styles.activityButton}
          >
            <BellIcon
              width={23}
              height={23}
              style={styles.activityButtonIcon}
            />

            {Array.isArray(activity) && !!activity[0] && activity[0].createdAt > user.lastViewedActivityAt && (
              <View style={styles.activityNewIcon} />
            )}
          </TouchableOpacity>
        </View>

        <BabbleTiledIconsBackground
          iconComponents={[ MessageSquareIcon, HeartIcon ]}
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  activityButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: 40,
  },
  activityButtonIcon: {
    color: '#2A99CC',
  },
  activityNewIcon: {
    backgroundColor: '#FF0000',
    borderColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
  },
  babbleLogoText: {
    fontFamily: 'Lobster-Regular',
    fontSize: 32,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
    paddingVertical: 10,
  },
  headerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 40,
    paddingLeft: 15,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 40,
    paddingRight: 15,
  },
  text: {
    color: '#FFFFFF',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  userButton: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
});
