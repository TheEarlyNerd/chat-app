import React, { Component } from 'react';
import { Animated, StatusBar } from 'react-native';

// temp
import LandingScreen from './screens/LandingScreen';

export default class App extends Component {
  state = {
    containerOpacityAnimated: new Animated.Value(0),
  }

  componentDidMount() {
    this.animateContainerOpacity(1, 750);
  }

  animateContainerOpacity(toValue, duration) {
    return new Promise(resolve => {
      Animated.timing(this.state.containerOpacityAnimated, {
        toValue,
        duration,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  render() {
    return (
      <Animated.View style={{ flex: 1, opacity: this.state.containerOpacityAnimated }}>
        <StatusBar barStyle={'light-content'} />
        <LandingScreen />
      </Animated.View>
    );
  }
}
