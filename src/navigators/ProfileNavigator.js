import React from 'react';
import { ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';
import maestro from '../maestro';

import ConversationInfoScreen from '../screens/ConversationInfoScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ConversationUsersScreen from '../screens/ConversationUsersScreen';
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
        name={'ConversationInfo'}
        component={ConversationInfoScreen}
        options={{
          title: 'Conversation Info',
          backEnabled: true,
        }}
      />

      <ProfileStack.Screen
        name={'Conversation'}
        component={ConversationScreen}
        options={{
          backEnabled: true,
          title: <ActivityIndicator color={'#FFFFFF'} />,
        }}
      />

      <ProfileStack.Screen
        name={'ConversationUsers'}
        component={ConversationUsersScreen}
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
