import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader, BabbleHomeHeader } from '../components';

import ConversationInfoScreen from '../screens/ConversationInfoScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ConversationsListScreen from '../screens/ConversationsListScreen';
import ConversationUsersScreen from '../screens/ConversationUsersScreen';
import HomeScreen from '../screens/HomeScreen';
import LandingScreen from '../screens/LandingScreen';
import PhoneLoginCodeScreen from '../screens/PhoneLoginCodeScreen';
import SetupIOSNotificationsScreen from '../screens/SetupIOSNotificationsScreen';
import SetupProfileScreen from '../screens/SetupProfileScreen';
import SplitEmptyStateScreen from '../screens/SplitEmptyStateScreen';

import TabNavigator from './TabNavigator';

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
        options={({ route }) => ({
          animationEnabled: !route.params || route.params.animationEnabled !== false,
          backEnabled: initialRouteName !== 'Conversation',
          closeEnabled: initialRouteName === 'Conversation',
        })}
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
        options={{
          header: ({ scene }) => <BabbleHomeHeader scene={scene} />,
        }}
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
          gestureEnabled: true,
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

      <MainStack.Screen
        name={'SplitEmptyState'}
        component={SplitEmptyStateScreen}
        options={{
          headerShown: false,
        }}
      />

      <MainStack.Screen
        name={'TabNavigator'}
        component={TabNavigator}
        options={{
          header: ({ scene }) => <BabbleHomeHeader scene={scene} />,
        }}
      />
    </MainStack.Navigator>
  );
};
