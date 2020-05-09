import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';

import ProfileScreen from '../screens/ProfileScreen';

export default props => {
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
        name={'Profile'}
        component={ProfileScreen}
        options={{ closeEnabled: true }}
      />
    </ProfileStack.Navigator>
  );
};
