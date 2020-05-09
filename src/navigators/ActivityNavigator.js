import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';

import ActivityScreen from '../screens/ActivityScreen';

export default props => {
  const ActivityStack = createStackNavigator();

  return (
    <ActivityStack.Navigator
      initialRouteName={'Activity'}
      headerMode={'screen'}
      screenOptions={{
        header: ({ scene }) => <BabbleHeader scene={scene} />,
      }}
    >
      <ActivityStack.Screen
        name={'Activity'}
        component={ActivityScreen}
        options={{
          closeEnabled: true,
          title: 'Activity',
        }}
      />
    </ActivityStack.Navigator>
  );
};
