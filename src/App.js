import React, { Component } from 'react';
import { Animated, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BabbleOverlaysContainer } from './components';
import RootNavigator from './navigators/RootNavigator';

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
    const navigationTheme = {
      colors: { background: '#FFFFFF' },
    };

    return (
      <NavigationContainer theme={navigationTheme}>
        <Animated.View style={{ flex: 1, opacity: this.state.containerOpacityAnimated }}>
          <StatusBar barStyle={'light-content'} />
          <RootNavigator />
          <BabbleOverlaysContainer />
        </Animated.View>
      </NavigationContainer>
    );
  }
}
