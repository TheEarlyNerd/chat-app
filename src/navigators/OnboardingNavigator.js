import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from '../screens/LandingScreen';
import PhoneLoginCodeScreen from '../screens/PhoneLoginCodeScreen';
import SetupIOSNotificationsScreen from '../screens/SetupIOSNotificationsScreen';
import SetupProfileScreen from '../screens/SetupProfileScreen';

export default props => {
  const OnboardingStack = createStackNavigator();

  return (
    <OnboardingStack.Navigator
      headerMode={'none'}
      initialRouteName={'Landing'}
    >
      <OnboardingStack.Screen
        name={'Landing'}
        component={LandingScreen}
      />

      <OnboardingStack.Screen
        name={'PhoneLoginCode'}
        component={PhoneLoginCodeScreen}
      />

      <OnboardingStack.Screen
        name={'SetupIOSNotifications'}
        component={SetupIOSNotificationsScreen}
      />

      <OnboardingStack.Screen
        name={'SetupProfile'}
        component={SetupProfileScreen}
      />
    </OnboardingStack.Navigator>
  );
};
