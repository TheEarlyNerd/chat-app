import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ConversationScreen from '../screens/ConversationScreen';
import HomeScreen from '../screens/HomeScreen';
import LandingScreen from '../screens/LandingScreen';
import PhoneLoginCodeScreen from '../screens/PhoneLoginCodeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SetupProfileScreen from '../screens/SetupProfileScreen';

export default props => {
  const MainStack = createStackNavigator();

  return (
    <MainStack.Navigator
      initialRouteName={'Conversation'}
      screenOptions={{ headerShown: false }}
    >
      <MainStack.Screen
        name={'Conversation'}
        component={ConversationScreen}
      />

      <MainStack.Screen
        name={'Home'}
        component={HomeScreen}
      />

      <MainStack.Screen
        name={'Landing'}
        component={LandingScreen}
      />

      <MainStack.Screen
        name={'PhoneLoginCode'}
        component={PhoneLoginCodeScreen}
      />

      <MainStack.Screen
        name={'Profile'}
        component={ProfileScreen}
      />

      <MainStack.Screen
        name={'SetupProfile'}
        component={SetupProfileScreen}
      />
    </MainStack.Navigator>
  );
};
