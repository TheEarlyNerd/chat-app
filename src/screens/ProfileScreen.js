import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { BabbleButton, BabbleConversationPreview, BabbleUserAvatar, BabbleTiledIconsBackground } from '../components';
import { UserIcon, SmileIcon } from '../components/icons';

export default class ProfileScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bottomBar}>
          <BabbleButton inverted style={[ styles.button, styles.followButton ]}>Follow</BabbleButton>
          <BabbleButton inverted style={styles.button}>Message</BabbleButton>

          <BabbleTiledIconsBackground
            bottom
            iconComponents={[ UserIcon, SmileIcon ]}
            iconSize={20}
            iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
            iconSpacing={25}
            linearGradientRotationAngle={-6}
            linearGradientProps={{
              colors: [ '#299BCB', '#1ACCB4' ],
              locations: [ 0, 0.7 ],
              useAngle: true,
              angle: 36,
            }}
            style={styles.backgroundGradient}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  bottomBar: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    height: 130,
    left: 0,
    padding: 15,
    position: 'absolute',
    right: 0,
  },
  button: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  followButton: {
    marginRight: 15,
  },
});
