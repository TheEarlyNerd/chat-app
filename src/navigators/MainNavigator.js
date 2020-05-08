import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';

import ActivityScreen from '../screens/ActivityScreen';
import ConversationScreen from '../screens/ConversationScreen';
import HomeScreen from '../screens/HomeScreen';

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
        name={'Activity'}
        component={ActivityScreen}
        options={{
          backEnabled: true,
          title: 'Activity',
        }}
      />

      <MainStack.Screen
        name={'Conversation'}
        component={ConversationScreen}
        options={{ backEnabled: true }}
      />

      <MainStack.Screen
        name={'Home'}
        component={HomeScreen}
        options={{ showActivityButton: true }}
      />
    </MainStack.Navigator>
  );
};
