import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from '../screens/LandingScreen';
import PhoneLoginCodeScreen from '../screens/PhoneLoginCodeScreen';
import SetupProfileScreen from '../screens/SetupProfileScreen';

export default props => {
  const MainStack = createStackNavigator();

  return (
    <MainStack.Navigator
      initialRouteName={'SetupProfile'}
      screenOptions={{ headerShown: false }}
    >
      <MainStack.Screen
        name={'Landing'}
        component={LandingScreen}
      />

      <MainStack.Screen
        name={'PhoneLoginCode'}
        component={PhoneLoginCodeScreen}
      />

      <MainStack.Screen
        name={'SetupProfile'}
        component={SetupProfileScreen}
      />
    </MainStack.Navigator>
  );
};
