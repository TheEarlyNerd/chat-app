import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import NavigationTypeContext from './contexts/NavigationTypeContext';
import maestro from '../maestro';

const { navigationHelper } = maestro.helpers;

export default () => {
  return (
    <View style={styles.container}>
      <View style={styles.sidebarContainer}>
        <NavigationTypeContext.Provider value={'sidebar'}>
          <NavigationContainer
            independent
            theme={{ colors: { background: '#FFFFFF' } }}
            ref={navigation => navigationHelper.setSplitSidebarNavigation(navigation)}
          >
            {MainNavigator('TabNavigator')}
          </NavigationContainer>
        </NavigationTypeContext.Provider>
      </View>

      <View style={styles.contentContainer}>
        <NavigationTypeContext.Provider value={'content'}>
          <NavigationContainer
            independent
            theme={{ colors: { background: '#FFFFFF' } }}
            ref={navigation => navigationHelper.setSplitContentNavigation(navigation)}
          >
            {MainNavigator('SplitEmptyState')}
          </NavigationContainer>
        </NavigationTypeContext.Provider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1.618,
  },
  sidebarContainer: {
    borderRightColor: '#979797',
    borderRightWidth: 0.5,
    flex: 1,
  },
});
