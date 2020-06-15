import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { UsersIcon, MessageCircleIcon, LockIcon } from './icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;

export default class BabbleConversationHeaderTitle extends Component {
  state = {
    subtext: 'Tap here for conversation info...',
    subtextOpacityAnimated: new Animated.Value(1),
  }

  async componentDidMount() {
    await this._toggleSubtext(false);

    this.setState({ subtext: this._getSubtext() });

    await this._toggleSubtext(true);
  }

  _getTitle = () => {
    const { user, title } = this.props.conversation;

    if (title) {
      return title;
    }

    return user.name;
  }

  _getSubtext = () => {
    const { accessLevel, user, usersCount } = this.props.conversation;
    const loggedInUserId = userManager.store.user.id;
    const username = (user.id === loggedInUserId) ? 'You' : `@${user.username}`;
    const permission = (accessLevel === 'protected') ? 'V.I.P.' : accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1);
    const count = (usersCount > 2) ? `${usersCount - 1} others` : '1 other';

    return (usersCount === 1)
      ? `${permission} | ${username}`
      : `${permission} | ${username} & ${count}`;
  }

  _toggleSubtext = show => {
    return new Promise(resolve => {
      Animated.timing(this.state.subtextOpacityAnimated, {
        toValue: (show) ? 1 : 0,
        duration: (show) ? 1000 : 500,
        delay: (show) ? 250 : 3500,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  render() {
    const { accessLevel } = this.props.conversation;
    const { subtext, subtextOpacityAnimated } = this.state;

    return (
      <TouchableOpacity style={styles.container}>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.titleText}>{this._getTitle()}</Text>

          <View style={styles.subtextContainer}>
            {accessLevel === 'public' && (
              <MessageCircleIcon width={16} height={16} style={styles.accessLevelIcon} />
            )}

            {accessLevel === 'protected' && (
              <UsersIcon width={16} height={16} style={styles.accessLevelIcon} />
            )}

            {accessLevel === 'private' && (
              <LockIcon width={16} height={16} style={styles.accessLevelIcon} />
            )}

            <Animated.Text style={[ styles.subtext, { opacity: subtextOpacityAnimated } ]}>
              {subtext}
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  accessLevelIcon: {
    color: '#FFFFFFCC',
    marginRight: 5,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    marginLeft: 20,
    marginRight: 15,
    minHeight: 40,
  },
  subtext: {
    color: '#FFFFFFCC',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
  subtextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: -2,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Black',
    fontSize: 16,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});
