import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleUserAvatar } from './';
import { RepeatIcon, UserPlusIcon } from './icons';
import maestro from '../maestro';

const { navigationHelper, timeHelper } = maestro.helpers;

export default class BabbleActivity extends Component {
  _onPress = () => {
    const { roomRepost, userFollower } = this.props.activity;

    if (roomRepost) {
      navigationHelper.push('ProfileNavigator', {
        screen: 'Profile',
        params: { userId: roomRepost.user.id },
      });
    }

    if (userFollower) {
      navigationHelper.push('ProfileNavigator', {
        screen: 'Profile',
        params: { userId: userFollower.followerUser.id },
      });
    }
  }

  _getActivityUser = () => {
    const { roomRepost, userFollower } = this.props.activity;

    if (roomRepost) {
      return roomRepost.user;
    }

    if (userFollower) {
      return userFollower.followerUser;
    }
  }

  _getTime = () => {
    const { roomRepost, userFollower } = this.props.activity;

    if (roomRepost) {
      return timeHelper.fromNow(roomRepost.createdAt);
    }

    if (userFollower) {
      return timeHelper.fromNow(userFollower.createdAt);
    }
  }

  _getActivityText = () => {
    const { roomRepost, userFollower } = this.props.activity;

    if (roomRepost) {
      return `${roomRepost.user.name} (@${roomRepost.user.username}) reposted your room "${roomRepost.room.title}" to their profile and shared it with their followers!`;
    }

    if (userFollower) {
      return `${userFollower.followerUser.name} (@${userFollower.followerUser.username}) is now following you!`;
    }
  }

  _getActivityIcon = () => {
    const { roomRepost, userFollower } = this.props.activity;

    if (roomRepost) {
      return (<RepeatIcon width={15} height={15} style={styles.activityIcon} />);
    }

    if (userFollower) {
      return (<UserPlusIcon width={15} height={15} style={styles.activityIcon} />);
    }
  }

  _getHeading = () => {
    const { roomRepost, userFollower } = this.props.activity;

    if (roomRepost) {
      return 'Your Room Was Reposted.';
    }

    if (userFollower) {
      return 'You Have A New Follower.';
    }
  }

  render() {
    const activityUser = this._getActivityUser();

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={styles.container}
      >
        <BabbleUserAvatar
          avatarAttachment={activityUser.avatarAttachment}
          lastActiveAt={activityUser.lastActiveAt}
          disabled
          size={50}
        />

        <View style={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{this._getHeading()}</Text>

            <View style={styles.headingRight}>
              {this._getActivityIcon()}
              <Text style={[ styles.headingRightText, styles.bulletText ]}>•</Text>
              <Text style={[ styles.headingRightText ]}>{this._getTime()}</Text>
            </View>
          </View>

          <Text
            numberOfLines={2}
            style={styles.activityText}
          >
            {this._getActivityText()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  activityIcon: {
    color: '#797979',
    marginTop: 1,
  },
  activityText: {
    color: '#797979',
    flexShrink: 1,
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 13,
  },
  bulletText: {
    fontSize: 10,
    paddingHorizontal: 3,
    paddingTop: 1.5,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headingRight: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  headingRightText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 13,
  },
  headingText: {
    color: '#404040',
    flex: 1,
    fontFamily: 'NunitoSans-Bold',
    fontSize: 15,
    marginBottom: 1,
  },
});
