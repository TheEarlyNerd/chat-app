import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BabbleUserAvatar } from './';
import { EditIcon } from './icons';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { navigationHelper, interfaceHelper } = maestro.helpers;

export default class BabbleUserPreview extends Component {
  static contextType = NavigationTypeContext;

  _onPress = () => {
    const { user } = this.props;

    navigationHelper.push('ProfileNavigator', {
      screen: 'Profile',
      params: { userId: user.id },
    });
  }

  _onMessagePress = () => {
    if (this.context === 'sidebar') {
      navigationHelper.reset('Room', {
        backEnabled: false,
        composeToUsers: [ this.props.user ],
      }, 'content');
    } else {
      navigationHelper.push('Room', { composeToUsers: [ this.props.user ] }, this.context);
    }
  }

  render() {
    const { user, style } = this.props;

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[ styles.container, style ]}
      >
        <BabbleUserAvatar
          avatarAttachment={user.avatarAttachment}
          lastActiveAt={user.lastActiveAt}
          disabled
          size={50}
        />

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.nameText}>{user.name}</Text>
          <Text numberOfLines={1} style={styles.usernameText}>{user.username ? `@${user.username}` : '(Invited to Babble)'}</Text>
          {!!user.about && (
            <Text numberOfLines={3} style={styles.aboutText}>{user.about}</Text>
          )}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={this._onMessagePress}
            style={styles.messageButton}
          >
            <EditIcon width={18} height={18} style={styles.messageIcon} />

            <LinearGradient
              useAngle
              angle={36}
              colors={[ '#299BCB', '#1ACCB4' ]}
              style={styles.linearGradientBackground}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  aboutText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 13, lg: 14 }),
    marginTop: 1,
  },
  buttons: {

  },
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  linearGradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    zIndex: -1,
  },
  messageButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 35,
    justifyContent: 'center',
    width: 35,
  },
  messageIcon: {
    color: '#FFFFFF',
  },
  nameText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 17 }),
  },
  usernameText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 13, lg: 15 }),
  },
});
