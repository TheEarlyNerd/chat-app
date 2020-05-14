import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BabbleUserAvatar, BabbleButton } from './';

export default class BabbleUserProfileSummary extends Component {
  render() {
    const { user, showEdit, style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <View style={styles.user}>
          <BabbleUserAvatar
            activityIconStyle={styles.avatarActivityIcon}
            avatarAttachment={user.avatarAttachment}
            size={60}
          />

          <View style={styles.details}>
            <Text style={styles.nameText}>{user.name}</Text>
            <Text style={styles.usernameText}>@{user.username}</Text>
          </View>

          <View style={styles.followers}>
            <Text style={styles.followersText}>Followers</Text>
            <Text style={styles.followersCountText}>{user.followersCount}</Text>
          </View>
        </View>

        {!!user.about && (
          <Text style={styles.aboutText} numberOfLines={3}>{user.about}</Text>
        )}

        <View style={styles.buttons}>
          {showEdit && (
            <BabbleButton style={[ styles.button ]}>Edit Profile</BabbleButton>
          )}

          {!showEdit && (
            <>
              <BabbleButton style={[ styles.button, styles.followButton ]}>Follow</BabbleButton>
              <BabbleButton style={styles.button}>Message</BabbleButton>
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
    fontSize: 14,
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
    fontSize: 16,
  },
  linkText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  nameText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
  },
  user: {
    flexDirection: 'row',
  },
  usernameText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
});
