import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleTiledIconsBackground, BabbleUserAvatar } from './';
import { ArrowLeftIcon, MessageSquareIcon, HeartIcon, BellIcon } from './icons';

const BabbleHeader = ({ scene }) => {
  const { route, descriptor } = scene;
  const { navigation, options } = descriptor;
  const params = scene.route.params || {};
  const title = options.title || params.title || null;

  console.log(scene);

  const { backEnabled } = options;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerLeft}>
        {!backEnabled && (
          <BabbleUserAvatar
            source={{ uri: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-9/71572992_2728234020533981_2005024985860538368_n.jpg?_nc_cat=105&_nc_sid=85a577&_nc_oc=AQm3dmHq4bGkok28oCH8ApLDfEeSaW_It8Sh_pSEX_TkbLpSGjaKsehzOC61rrBy4JhCoRFwIp-1is1cEmrOxA66&_nc_ht=scontent-sea1-1.xx&oh=39ff988af3d5e90acb04e560f6526acb&oe=5EC57631' }}
            size={40}
            imageStyle={styles.userButton}
            onPress={() => navigation.push('Profile')}
          />
        )}

        {backEnabled && (
          <TouchableOpacity onPress={() => navigation.pop()} style={styles.backButton}>
            <ArrowLeftIcon
              width={33}
              height={33}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerCenter}>
        {route.name === 'Home' && (
          <Text style={[ styles.text, styles.babbleLogoText ]}>Babble</Text>
        )}

        {!!title && (
          <Text style={[ styles.text, styles.titleText ]}>{title}</Text>
        )}
      </View>

      <View style={styles.headerRight}>
        {false && (
          <TouchableOpacity style={styles.activityButton}>
            <BellIcon width={23} height={23} style={styles.activityButtonIcon} />
          </TouchableOpacity>
        )}
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
};

export default BabbleHeader;

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
  babbleLogoText: {
    fontFamily: 'Lobster-Regular',
    fontSize: 32,
  },
  backButton: {
    marginTop: -1,
  },
  backIcon: {
    borderColor: '#FFFFFF',
    color: '#FFFFFF',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 100,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerLeft: {
    bottom: 10,
    left: 15,
    position: 'absolute',
  },
  headerRight: {
    bottom: 10,
    position: 'absolute',
    right: 15,
  },
  text: {
    color: '#FFFFFF',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  titleText: {
    fontFamily: 'NunitoSans-Black',
    fontSize: 20,
  },
  userButton: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
});
