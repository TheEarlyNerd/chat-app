import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import ActivityNavigator from './ActivityNavigator';
import MainNavigator from './MainNavigator';
import ProfileNavigator from './ProfileNavigator';
import SplitMainNavigator from './SplitMainNavigator';
import WebBrowserNavigator from './WebBrowserNavigator';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default props => {
  const RootStack = createStackNavigator();

  return (
    <RootStack.Navigator
      initialRouteName={interfaceHelper.deviceValue({
        default: 'MainNavigator',
        lg: 'SplitMainNavigator',
      })}
      mode={'modal'}
      headerMode={'none'}
      screenOptions={{
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        cardStyle: {
          backgroundColor: 'transparent',
        },
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
        name={'SplitMainNavigator'}
        component={SplitMainNavigator}
      />

      <RootStack.Screen
        name={'WebBrowserNavigator'}
        component={WebBrowserNavigator}
      />
    </RootStack.Navigator>
  );
};
