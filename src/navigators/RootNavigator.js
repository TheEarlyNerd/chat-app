import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityNavigator from './ActivityNavigator';
import MainNavigator from './MainNavigator';
import ProfileNavigator from './ProfileNavigator';
import SplitMainNavigator from './SplitMainNavigator';
import WebBrowserNavigator from './WebBrowserNavigator';
import ModalPopupTransition from './transitions/ModalPopupTransition';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;
const { userManager } = maestro.managers;

export default props => {
  const RootStack = createStackNavigator();

  return (
    <RootStack.Navigator
      initialRouteName={interfaceHelper.deviceValue({
        default: 'MainNavigator',
        lg: (userManager.store.user) ? 'SplitMainNavigator' : 'MainNavigator',
      })}
      mode={'modal'}
      headerMode={'none'}
      screenOptions={{
        ...ModalPopupTransition,
        cardOverlayEnabled: true,
        cardStyle: {
          backgroundColor: 'transparent',
        },
        safeAreaInsets: interfaceHelper.deviceValue({
          default: undefined,
          lg: { top: 0 },
        }),
      }}
    >
      <RootStack.Screen
        name={'ActivityNavigator'}
        component={ActivityNavigator}
      />

      <RootStack.Screen name={'MainNavigator'}>
        {() => MainNavigator(props.initialRouteName)}
      </RootStack.Screen>

      <RootStack.Screen name={'NewRoomNavigator'}>
        {() => MainNavigator('Room')}
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
