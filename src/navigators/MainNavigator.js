import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';

import ConversationInfoScreen from '../screens/ConversationInfoScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ConversationsListScreen from '../screens/ConversationsListScreen';
import ConversationUsersScreen from '../screens/ConversationUsersScreen';
import HomeScreen from '../screens/HomeScreen';
import LandingScreen from '../screens/LandingScreen';
import PhoneLoginCodeScreen from '../screens/PhoneLoginCodeScreen';
import SetupIOSNotificationsScreen from '../screens/SetupIOSNotificationsScreen';
import SetupProfileScreen from '../screens/SetupProfileScreen';

export default initialRouteName => {
  const MainStack = createStackNavigator();

  return (
    <MainStack.Navigator
      initialRouteName={initialRouteName}
      headerMode={'screen'}
      screenOptions={{
        header: ({ scene }) => <BabbleHeader scene={scene} />,
      }}
    >
      <MainStack.Screen
        name={'ConversationInfo'}
        component={ConversationInfoScreen}
        options={{
          title: 'Conversation Info',
          backEnabled: true,
        }}
      />

      <MainStack.Screen
        name={'Conversation'}
        component={ConversationScreen}
        options={{
          backEnabled: true,
        }}
      />

      <MainStack.Screen
        name={'ConversationsList'}
        component={ConversationsListScreen}
        options={{ backEnabled: true }}
      />

      <MainStack.Screen
        name={'ConversationUsers'}
        component={ConversationUsersScreen}
        options={{
          backEnabled: true,
          title: 'Participants',
        }}
      />

      <MainStack.Screen
        name={'Home'}
        component={HomeScreen}
        options={{ showActivityButton: true }}
      />

      <MainStack.Screen
        name={'Landing'}
        component={LandingScreen}
        options={{
          headerShown: false,
        }}
      />

      <MainStack.Screen
        name={'PhoneLoginCode'}
        component={PhoneLoginCodeScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <MainStack.Screen
        name={'SetupIOSNotifications'}
        component={SetupIOSNotificationsScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <MainStack.Screen
        name={'SetupProfile'}
        component={SetupProfileScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  );
};
