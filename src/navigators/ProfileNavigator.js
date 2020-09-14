import React from 'react';
import { ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';
import ModalPopupCardStyleInterpolator from './interpolators/ModalPopupCardStyleInterpolator';
import maestro from '../maestro';

import RoomInfoScreen from '../screens/RoomInfoScreen';
import RoomScreen from '../screens/RoomScreen';
import RoomUsersScreen from '../screens/RoomUsersScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ProfileScreen from '../screens/ProfileScreen';

const { interfaceHelper } = maestro.helpers;

export default () => {
  const ProfileStack = createStackNavigator();

  return (
    <ProfileStack.Navigator
      initialRouteName={'Profile'}
      headerMode={'screen'}
      screenOptions={{
        header: ({ scene }) => <BabbleHeader scene={scene} />,
        cardStyleInterpolator: ModalPopupCardStyleInterpolator,
        cardStyle: interfaceHelper.deviceValue({
          default: {},
          lg: {
            alignSelf: 'center',
            borderRadius: 10,
            marginVertical: '15%',
            width: 550,
          },
        }),
      }}
    >
      <ProfileStack.Screen
        name={'RoomInfo'}
        component={RoomInfoScreen}
        options={{
          title: 'Room Info',
          backEnabled: true,
        }}
      />

      <ProfileStack.Screen
        name={'Room'}
        component={RoomScreen}
        options={{
          backEnabled: true,
          title: <ActivityIndicator color={'#FFFFFF'} />,
        }}
      />

      <ProfileStack.Screen
        name={'RoomUsers'}
        component={RoomUsersScreen}
        options={{
          backEnabled: true,
          title: 'Participants',
        }}
      />

      <ProfileStack.Screen
        name={'ProfileEdit'}
        component={ProfileEditScreen}
        options={{
          backEnabled: true,
          title: 'Edit Profile',
          rightButtonTitle: 'Save',
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
