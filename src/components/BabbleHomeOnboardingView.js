import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BabbleButton } from './';
import { UsersIcon, MessageCircleIcon } from './icons';
import maestro from '../maestro';

const { navigationHelper, interfaceHelper } = maestro.helpers;

const slideItems = [
  {
    emoji: '🎉',
    title: 'Welcome To Babble!',
    text: 'Instantly stay in touch with the people and things that matter most to you.',
  },
  {
    emoji: '🚪🔑',
    title: 'Private Rooms',
    text: 'Create private rooms as a place to hang out and stay in touch with the people that matter to you.',
  },
  {
    emoji: '🚪💬',
    title: 'Public Rooms',
    text: 'Create or join public rooms to chat with others who care about the same things as you.',
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
    slideWidth: 0,
  }

  _browseRooms = () => {
    navigationHelper.navigate('DiscoverTab', null, 'sidebar');
  }

  _createPrivateRoom = () => {
    if ([ 'xs', 'sm', 'md' ].includes(interfaceHelper.screenBreakpoint())) {
      navigationHelper.navigate('NewRoomNavigator', {
        screen: 'Room',
        params: {
          composeAccessLevel: 'private',
        },
      });
    } else {
      navigationHelper.reset('Room', {
        backEnabled: false,
        composeAccessLevel: 'private',
      }, 'content');
    }
  }

  _onScrollEnd = ({ nativeEvent }) => {
    const { contentOffset, layoutMeasurement } = nativeEvent;

    this.setState({ currentIndex: Math.floor(contentOffset.x / layoutMeasurement.width) });
  }

  render() {
    const { currentIndex, slideWidth } = this.state;

    return (
      <View style={styles.container}>
        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={this._onScrollEnd}
            onLayout={({ nativeEvent }) => this.setState({ slideWidth: nativeEvent.layout.width })}
            horizontal
            pagingEnabled
          >
            {slideItems.map((item, index) => (
              <View style={[ styles.slide, { width: slideWidth } ]} key={`slide-${index}`}>
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
            <BabbleButton onPress={this._browseRooms} style={styles.button}>
              <MessageCircleIcon
                height={interfaceHelper.deviceValue({ default: 21, lg: 24 })}
                width={interfaceHelper.deviceValue({ default: 21, lg: 24 })}
                style={styles.icon}
              />

              <Text>Browse Public Rooms</Text>
            </BabbleButton>

            <BabbleButton onPress={this._createPrivateRoom} style={styles.button}>
              <UsersIcon
                height={interfaceHelper.deviceValue({ default: 21, lg: 24 })}
                width={interfaceHelper.deviceValue({ default: 21, lg: 24 })}
                style={styles.icon}
              />

              <Text>Create Room With Friends</Text>
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
    maxWidth: 450,
  },
  buttonsContainer: {
    alignItems: 'center',
    paddingHorizontal: interfaceHelper.deviceValue({ default: 30, lg: 60 }),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: interfaceHelper.deviceValue({ default: 72, lg: 90 }),
    marginBottom: 10,
  },
  explainerText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 16, lg: 20 }),
    marginBottom: 10,
    maxWidth: 450,
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
  slide: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    width: 520,
  },
  welcomeTitle: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: interfaceHelper.deviceValue({ default: 24, lg: 32 }),
    marginBottom: 10,
  },
});
