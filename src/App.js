import React, { Component } from 'react';
import { Animated } from 'react-native';
import RootNavigator from './navigators/RootNavigator';

export default class App extends Component {
  componentDidMount() {
    this.animateVisibility(1, 750);
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
        <RootNavigator
          initialRouteName={this.state.initialRouteName}
        />
      </Animated.View>
    );
  }
}
