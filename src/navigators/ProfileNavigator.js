import React from 'react';
import { ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';

import ConversationScreen from '../screens/ConversationScreen';
import ProfileScreen from '../screens/ProfileScreen';

export default () => {
  const ProfileStack = createStackNavigator();

  return (
    <ProfileStack.Navigator
      initialRouteName={'Profile'}
      headerMode={'screen'}
      screenOptions={{
        header: ({ scene }) => <BabbleHeader scene={scene} />,
      }}
    >
      <ProfileStack.Screen
        name={'Conversation'}
        component={ConversationScreen}
        options={{
          backEnabled: true,
          title: <ActivityIndicator color={'#FFFFFF'} />,
        }}
      />

      <ProfileStack.Screen
        name={'Profile'}
        component={ProfileScreen}
        options={{
          closeEnabled: true,
          title: <ActivityIndicator color={'#FFFFFF'} />,
        }}
      />
    </ProfileStack.Navigator>
  );
};
