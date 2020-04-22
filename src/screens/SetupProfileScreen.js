import React, { Component } from 'react';
import { KeyboardAvoidingView, View, Text, Image, StyleSheet } from 'react-native';
import { BabbleTextField, BabbleUsernameField, BabbleButton, BabbleTiledIconsBackground } from '../components';
import { UserIcon } from '../components/icons';

export default class SetupProfileScreen extends Component {
  render() {
    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.container}
      >
        <View style={styles.previewContainer}>
          <BabbleTiledIconsBackground
            iconComponents={[ UserIcon ]}
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
            containerStyle={styles.fieldContainer}
          />

          <BabbleButton>Continue</BabbleButton>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  fieldContainer: {
    marginBottom: 35,
  },
});
