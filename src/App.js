import React, { Component } from 'react';
import { Animated, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BabbleOverlaysContainer } from './components';
import RootNavigator from './navigators/RootNavigator';
import maestro from './maestro';

const { userManager } = maestro.managers;
const { navigationHelper } = maestro.helpers;

export default class App extends Component {
  state = {
    initialRouteName: 'Landing',
    containerOpacityAnimated: new Animated.Value(0),
  }

  async componentDidMount() {
    maestro.link(this);

    await userManager.store.ready;

    this.setState({
      initialRouteName: userManager.nextRouteNameForUserState(),
    }, () => {
      setTimeout(() => this._toggleVisibility(true), 750);
    });
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  async receiveEvent(name, data) {
    if (name === 'NAVIGATION_RESET') {
      await this._toggleVisibility(false);

      await new Promise(resolve => {
        this.setState({ initialRouteName: data.routeName }, resolve);
      });

      this._toggleVisibility(true);
    }
  }

  _toggleVisibility = show => {
    return new Promise(resolve => {
      Animated.timing(this.state.containerOpacityAnimated, {
        toValue: (show) ? 1 : 0,
        duration: 750,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  render() {
    const { initialRouteName, containerOpacityAnimated } = this.state;
    return (
      <Animated.View style={{ flex: 1, opacity: containerOpacityAnimated }}>
        <NavigationContainer
          theme={{ colors: { background: '#FFFFFF' } }}
          ref={navigation => navigationHelper.setNavigation(navigation)}
          key={`navigation_base_${initialRouteName}`}
        >
          <StatusBar barStyle={'light-content'} />
          <RootNavigator initialRouteName={initialRouteName} />
          <BabbleOverlaysContainer />
        </NavigationContainer>
      </Animated.View>
    );
  }
}
