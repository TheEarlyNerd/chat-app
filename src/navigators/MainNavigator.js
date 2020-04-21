import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from '../screens/LandingScreen';
import PhoneLoginCodeScreen from '../screens/PhoneLoginCodeScreen';

export default props => {
  const MainStack = createStackNavigator();

  return (
    <MainStack.Navigator
      initialRouteName={'Landing'}
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
    </MainStack.Navigator>
  );
};
