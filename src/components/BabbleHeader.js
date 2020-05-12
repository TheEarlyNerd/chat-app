import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleTiledIconsBackground, BabbleUserAvatar } from './';
import { ArrowLeftIcon, MessageSquareIcon, HeartIcon, BellIcon, XIcon } from './icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;

const BabbleHeader = ({ scene }) => {
  const { user } = userManager.store;
  const { route, descriptor } = scene;
  const { navigation, options } = descriptor;
  const params = scene.route.params || {};
  const title = options.title || params.title || null;
  const showActivityButton = options.showActivityButton || params.showActivityButton || null;
  const { backEnabled, closeEnabled } = options;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerLeft}>
        {!!user && !backEnabled && !closeEnabled && (
          <BabbleUserAvatar
            source={{ uri: user.avatarAttachment.url }}
            size={40}
            imageStyle={styles.userButton}
            onPress={() => {
              navigation.push('ProfileNavigator', {
                screen: 'Profile',
                params: { userId: user.id },
              });
            }}
          />
        )}

        {(backEnabled || closeEnabled) && (
          <TouchableOpacity onPress={() => navigation.pop()} style={styles.backButton}>
            {closeEnabled && (
              <XIcon
                width={33}
                height={33}
                style={styles.backIcon}
              />
            )}

            {!closeEnabled && (
              <ArrowLeftIcon
                width={33}
                height={33}
                style={styles.backIcon}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerCenter}>
        {route.name === 'Home' && (
          <Text style={[ styles.text, styles.babbleLogoText ]}>Babble</Text>
        )}

        {!!title && typeof title === 'string' && (
          <Text style={[ styles.text, styles.titleText ]}>{title}</Text>
        )}

        {React.isValidElement(title) && title}
      </View>

      <View style={styles.headerRight}>
        {showActivityButton && (
          <TouchableOpacity
            onPress={() => navigation.push('ActivityNavigator')}
            style={styles.activityButton}
          >
            <BellIcon
              width={23}
              height={23}
              style={styles.activityButtonIcon}
            />
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
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 50,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  headerLeft: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  headerRight: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
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
