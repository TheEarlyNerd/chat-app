import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BabbleUserAvatar, BabbleButton } from './';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { navigationHelper, interfaceHelper } = maestro.helpers;

export default class BabbleProfileHeader extends Component {
  state = {
    authUserFollower: null,
    followersCount: 0,
  }

  componentDidMount() {
    const { authUserFollower, followersCount } = this.props.user;

    this.setState({ authUserFollower, followersCount });
  }

  _editProfilePress = () => {
    navigationHelper.push('ProfileEdit');
  }

  _followUnfollowPress = async () => {
    const userId = this.props.user.id;
    let followersCount = this.state.followersCount;
    let authUserFollower = (this.state.authUserFollower)
      ? { ...this.state.authUserFollower }
      : null;

    followersCount += (authUserFollower) ? -1 : 1;
    authUserFollower = (authUserFollower)
      ? await userManager.unfollowUser(userId)
      : await userManager.followUser(userId);

    this.setState({
      authUserFollower,
      followersCount,
    });
  }

  _messagePress = () => {
    navigationHelper.push('Room', { composeToUsers: [ this.props.user ] });
  }

  render() {
    const { user, showEdit, style } = this.props;
    const { authUserFollower, followersCount } = this.state;

    return (
      <View style={[ styles.container, style ]}>
        <View style={styles.user}>
          <BabbleUserAvatar
            avatarAttachment={user.avatarAttachment}
            lastActiveAt={user.lastActiveAt}
            statusIconStyle={styles.avatarActivityIcon}
            size={60}
          />

          <View style={styles.details}>
            <Text style={styles.nameText}>{user.name}</Text>
            <Text style={styles.usernameText}>{user.username ? `@${user.username}` : '(Invited to Babble)'}</Text>
          </View>

          <View style={styles.followers}>
            <Text style={styles.followersText}>Followers</Text>
            <Text style={styles.followersCountText}>{followersCount}</Text>
          </View>
        </View>

        {!!user.about && (
          <Text style={styles.aboutText} numberOfLines={3}>{user.about}</Text>
        )}

        <View style={styles.buttons}>
          {showEdit && (
            <BabbleButton
              onPress={this._editProfilePress}
              style={[ styles.button ]}
            >
              Edit Profile
            </BabbleButton>
          )}

          {!showEdit && (
            <>
              <BabbleButton
                onPress={this._followUnfollowPress}
                style={[ styles.button, styles.followButton ]}
              >
                {(authUserFollower) ? 'Unfollow' : 'Follow'}
              </BabbleButton>

              <BabbleButton
                onPress={this._messagePress}
                style={styles.button}
              >
                Message
              </BabbleButton>
            </>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  aboutText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBoldItalic',
    fontSize: 15,
    marginTop: 20,
  },
  avatarActivityIcon: {
    borderRadius: 10,
    height: 15,
    width: 15,
  },
  button: {
    flex: 1,
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
  },
  container: {
    width: '100%',
  },
  details: {
    justifyContent: 'center',
    marginLeft: 15,
    width: '43%',
  },
  followButton: {
    marginRight: 15,
  },
  followers: {
    alignItems: 'center',
    borderLeftColor: '#D8D8D8',
    borderLeftWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
    paddingLeft: 15,
  },
  followersCountText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 28,
  },
  followersText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 16, lg: 18 }),
  },
  nameText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 16, lg: 18 }),
  },
  user: {
    flexDirection: 'row',
  },
  usernameText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 17 }),
  },
});
