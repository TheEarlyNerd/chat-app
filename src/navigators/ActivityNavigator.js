import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';
import maestro from '../maestro';

import ActivityScreen from '../screens/ActivityScreen';

const { interfaceHelper } = maestro.helpers;

export default () => {
  const ActivityStack = createStackNavigator();

  return (
    <ActivityStack.Navigator
      initialRouteName={'Activity'}
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
