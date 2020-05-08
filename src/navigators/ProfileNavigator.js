import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';

import ProfileScreen from '../screens/ProfileScreen';

export default props => {
  const ProfileStack = createStackNavigator();

  return (
    <ProfileStack.Navigator
      initialRouteName={'profile'}
      headerMode={'screen'}
      screenOptions={{
        header: ({ scene }) => <BabbleHeader scene={scene} />,
      }}
    >
      <ProfileStack.Screen
        name={'Profile'}
        component={ProfileScreen}
        options={{
          closeEnabled: true,
        }}
      />
    </ProfileStack.Navigator>
  );
};

const styles = StyleSheet.create({

});
