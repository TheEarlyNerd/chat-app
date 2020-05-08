import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import ProfileNavigator from './ProfileNavigator';

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
        name={'MainNavigator'}
        component={MainNavigator}
      />

      <RootStack.Screen
        name={'ProfileNavigator'}
        component={ProfileNavigator}
      />
    </RootStack.Navigator>
  );
};
