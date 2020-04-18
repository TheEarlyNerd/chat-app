import React, { Component } from 'react';
import { View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { BabbleTiledIconsBackground } from '../components';
import { HeartIcon } from '../components/icons';

export default class LandingScreen extends Component {
  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.animationContainer}>
          <BabbleTiledIconsBackground
            iconComponents={[ HeartIcon ]}
            iconSize={20}
            iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
            iconSpacing={30}
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

        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animationContainer: {
    flex: 2,
    alignItems: 'center',
  },
  formContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
