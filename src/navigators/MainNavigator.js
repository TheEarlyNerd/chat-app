import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader, BabbleHomeHeader } from '../components';
import MainCardStyleInterpolator from './interpolators/MainCardStyleInterpolator';

import RoomInfoScreen from '../screens/RoomInfoScreen';
import RoomScreen from '../screens/RoomScreen';
import RoomsListScreen from '../screens/RoomsListScreen';
import RoomUsersScreen from '../screens/RoomUsersScreen';
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
        cardStyleInterpolator: MainCardStyleInterpolator,
      }}
    >
      <MainStack.Screen
        name={'RoomInfo'}
        component={RoomInfoScreen}
        options={{
          title: 'Room Info',
          backEnabled: true,
        }}
      />

      <MainStack.Screen
        name={'Room'}
        component={RoomScreen}
        options={({ route }) => ({
          animationEnabled: !route.params || route.params.animationEnabled !== false,
          backEnabled: initialRouteName !== 'Room',
          closeEnabled: initialRouteName === 'Room',
        })}
      />

      <MainStack.Screen
        name={'RoomsList'}
        component={RoomsListScreen}
        options={{ backEnabled: true }}
      />

      <MainStack.Screen
        name={'RoomUsers'}
        component={RoomUsersScreen}
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
