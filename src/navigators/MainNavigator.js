import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';

import ConversationScreen from '../screens/ConversationScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

export default props => {
  const MainStack = createStackNavigator();

  return (
    <MainStack.Navigator
      initialRouteName={'Home'}
      headerMode={'screen'}
      screenOptions={{
        header: ({ scene }) => <BabbleHeader scene={scene} />,
      }}
    >
      <MainStack.Screen
        name={'Conversation'}
        component={ConversationScreen}
        options={{ backEnabled: true }}
      />

      <MainStack.Screen
        name={'Home'}
        component={HomeScreen}
      />

      <MainStack.Screen
        name={'Profile'}
        component={ProfileScreen}
        options={{ backEnabled: true }}
      />
    </MainStack.Navigator>
  );
};
