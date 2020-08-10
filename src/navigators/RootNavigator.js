import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import ActivityNavigator from './ActivityNavigator';
import MainNavigator from './MainNavigator';
import ProfileNavigator from './ProfileNavigator';
import WebBrowserNavigator from './WebBrowserNavigator';

export default props => {
  const RootStack = createStackNavigator();

  return (
    <RootStack.Navigator
      initialRouteName={'MainNavigator'}
      mode={'modal'}
      headerMode={'none'}
      screenOptions={{
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <RootStack.Screen
        name={'ActivityNavigator'}
        component={ActivityNavigator}
      />

      <RootStack.Screen name={'MainNavigator'}>
        {() => MainNavigator(props.initialRouteName)}
      </RootStack.Screen>

      <RootStack.Screen
        name={'ProfileNavigator'}
        component={ProfileNavigator}
      />

      <RootStack.Screen
        name={'WebBrowserNavigator'}
        component={WebBrowserNavigator}
      />
    </RootStack.Navigator>
  );
};
