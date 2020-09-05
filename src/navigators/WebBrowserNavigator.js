import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BabbleHeader } from '../components';
import ModalPopupCardStyleInterpolator from './interpolators/ModalPopupCardStyleInterpolator';
import maestro from '../maestro';

import WebBrowserScreen from '../screens/WebBrowserScreen';

const { interfaceHelper } = maestro.helpers;

export default () => {
  const WebBrowserStack = createStackNavigator();

  return (
    <WebBrowserStack.Navigator
      initialRouteName={'WebBrowser'}
      headerMode={'screen'}
      screenOptions={{
        header: ({ scene }) => <BabbleHeader scene={scene} />,
        cardStyleInterpolator: ModalPopupCardStyleInterpolator,
        cardStyle: interfaceHelper.deviceValue({
          default: {},
          lg: {
            alignSelf: 'center',
            borderRadius: 10,
            marginVertical: '8%',
            width: '84%',
          },
        }),
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
