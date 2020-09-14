import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { BabbleButton } from './';
import { UsersIcon, MessageCircleIcon } from './icons';
import maestro from '../maestro';

const { navigationHelper } = maestro.helpers;

const windowWidth = Dimensions.get('window').width;

const slideItems = [
  {
    emoji: '🎉',
    title: 'Welcome To Babble!',
    text: 'Instantly stay in touch with the people and things that matter most to you.',
  },
  {
    emoji: '🚪🔑',
    title: 'Private Rooms',
    text: 'Create private rooms as a place for the people that matter to you to hang out and stay in touch.',
  },
  {
    emoji: '🚪💬',
    title: 'Public Rooms',
    text: 'Create or join public rooms to instantly chat with others that care about the same things as you.',
  },
  {
    emoji: '🚪✨',
    title: 'Audience Rooms',
    text: 'Create or join audience rooms as a place for specific people to chat while an audience reacts.',
  },
];

export default class BabbleHomeOnboardingView extends Component {
  state = {
    currentIndex: 0,
  }

  _browseRooms = () => {
    navigationHelper.navigate('DiscoverTab');
  }

  _createPrivateRoom = () => {
    navigationHelper.navigate('NewConversationNavigator', {
      screen: 'Conversation',
      params: {
        composeAccessLevel: 'private',
      },
    });
  }

  _onScrollEnd = ({ nativeEvent }) => {
    const { contentOffset, layoutMeasurement } = nativeEvent;

    this.setState({ currentIndex: Math.floor(contentOffset.x / layoutMeasurement.width) });
  }

  render() {
    const { currentIndex } = this.state;

    return (
      <View style={styles.container}>
        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={this._onScrollEnd}
            horizontal
            pagingEnabled
            style={styles.scrollView}
          >
            {slideItems.map((item, index) => (
              <View style={styles.slide} key={`slide-${index}`}>
                <Text style={styles.emojiText}>{item.emoji}</Text>
                <Text style={styles.welcomeTitle}>{item.title}</Text>
                <Text style={styles.explainerText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.paginationContainer}>
            {(new Array(slideItems.length)).fill('').map((item, index) => (
              <View
                key={`pagination-dot-${index}`}
                style={[ styles.paginationDot, (currentIndex === index) ? styles.paginationDotActive : null ]}
              />
            ))}
          </View>

          <View style={styles.buttonsContainer}>
            <BabbleButton onPress={this._createPrivateRoom} style={styles.button}>
              <UsersIcon height={21} width={21} style={styles.icon} />
              Create Room With Friends
            </BabbleButton>

            <BabbleButton onPress={this._browseRooms} style={styles.button}>
              <MessageCircleIcon height={21} width={21} style={styles.icon} />
              Browse Public Rooms
            </BabbleButton>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
  },
  buttonsContainer: {
    paddingHorizontal: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 72,
    marginBottom: 10,
  },
  explainerText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  icon: {
    color: '#FFFFFF',
    marginRight: 15,
  },
  paginationContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 15,
  },
  paginationDot: {
    backgroundColor: '#777777',
    borderRadius: 5,
    height: 8,
    marginHorizontal: 5,
    width: 8,
  },
  paginationDotActive: {
    backgroundColor: '#1ACCB4',
    height: 10,
    width: 10,
  },
  scrollView: {
    height: 220,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    width: windowWidth,
  },
  welcomeTitle: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 24,
    marginBottom: 10,
  },
});
