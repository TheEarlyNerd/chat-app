import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BabbleTabBar } from '../components';

import DiscoverScreen from '../screens/DiscoverScreen';
import HomeScreen from '../screens/HomeScreen';

export default () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator tabBar={props => <BabbleTabBar {...props} />}>
      <Tab.Screen
        name={'HomeTab'}
        component={HomeScreen}
      />

      <Tab.Screen
        name={'DiscoverTab'}
        component={DiscoverScreen}
      />
    </Tab.Navigator>
  );
};
