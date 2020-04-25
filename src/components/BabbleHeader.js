import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleTiledIconsBackground, BabbleUserAvatar } from './';
import { MessageSquareIcon, HeartIcon, BellIcon } from './icons';

const BabbleHeader = props => (
  <View style={[ styles.container, props.style ]}>
    <BabbleUserAvatar
      source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-9/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=85a577&_nc_oc=AQm3dmHq4bGkok28oCH8ApLDfEeSaW_It8Sh_pSEX_TkbLpSGjaKsehzOC61rrBy4JhCoRFwIp-1is1cEmrOxA66&_nc_ht=scontent-sea1-1.xx&oh=39ff988af3d5e90acb04e560f6526acb&oe=5EC57631' }}
      size={40}
      imageStyle={styles.userButton}
    />

    <Text style={styles.text}>Babble</Text>

    <TouchableOpacity style={styles.activityButton}>
      <BellIcon width={23} height={23} style={styles.activityButtonIcon} />
    </TouchableOpacity>

    <BabbleTiledIconsBackground
      iconComponents={[ MessageSquareIcon, HeartIcon ]}
      iconSize={20}
      iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
      iconSpacing={37}
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
);

export default BabbleHeader;

const styles = StyleSheet.create({
  container: {
    height: 90,
    paddingHorizontal: 15,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  userButton: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  text: {
    position: 'absolute',
    top: 45,
    left: 75,
    color: '#FFFFFF',
    fontFamily: 'Lobster-Regular',
    fontSize: 32,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  activityButton: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  activityButtonIcon: {
    color: '#2A99CC',
  },
});
