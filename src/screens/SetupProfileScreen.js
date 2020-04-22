import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BabbleTextField, BabbleUsernameField, BabbleButton, BabbleTiledIconsBackground, BabbleUserAvatar } from '../components';
import { SmileIcon, CameraIcon } from '../components/icons';

const windowHeight = Dimensions.get('window').height;

export default class SetupProfileScreen extends Component {
  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.previewContainer}>
          <BabbleUserAvatar
            source={{ uri: '' }}
            size={125}
          />

          <Text style={[ styles.previewText, styles.previewNameText ]}>Welcome to <Text style={styles.logoText}>Babble</Text></Text>
          <Text style={[ styles.previewText, styles.previewUsernameText ]}>Let's Setup Your Account!</Text>

          <BabbleTiledIconsBackground
            iconComponents={[ SmileIcon, CameraIcon ]}
            iconSize={20}
            iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
            iconSpacing={37}
            linearGradientRotationAngle={-9}
            linearGradientProps={{
              colors: [ '#299BCB', '#1ACCB4' ],
              locations: [ 0, 0.7 ],
              useAngle: true,
              angle: 36,
            }}
            style={styles.backgroundGradient}
          />
        </View>

        <View style={styles.formContainer}>
          <BabbleTextField
            label={'Name'}
            containerStyle={styles.fieldContainer}
          />

          <BabbleUsernameField
            label={'Username'}
            info={'You can always change this later.'}
            containerStyle={styles.lastFieldContainer}
          />

          <BabbleButton>Continue</BabbleButton>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  previewContainer: {
    height: windowHeight / 2,
    alignItems: 'center',
    justifyContent: 'center', //temp
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 70,
    paddingBottom: 50,
  },
  logoText: {
    fontFamily: 'Lobster-Regular',
  },
  previewText: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  previewNameText: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 36,
  },
  previewUsernameText: {
    fontSize: 22,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  fieldContainer: {
    marginBottom: 35,
  },
  lastFieldContainer: {
    marginBottom: 50,
  },
});
