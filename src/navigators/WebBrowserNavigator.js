import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';

import WebBrowserScreen from '../screens/WebBrowserScreen';

export default () => {
  const WebBrowserStack = createStackNavigator();

  return (
    <WebBrowserStack.Navigator
      initialRouteName={'WebBrowser'}
      headerMode={'screen'}
      screenOptions={{
        header: ({ scene }) => <BabbleHeader scene={scene} />,
      }}
    >
      <WebBrowserStack.Screen
        name={'WebBrowser'}
        component={WebBrowserScreen}
        options={{
          title: 'Loading...',
          closeEnabled: true,
        }}
      />
    </WebBrowserStack.Navigator>
  );
};
