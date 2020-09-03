import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import maestro from '../maestro';

const { navigationHelper } = maestro.helpers;

export default () => {
  return (
    <View style={styles.root}>
      <View style={styles.sidebarContainer}>
        <NavigationContainer
          independent
          theme={{ colors: { background: '#FFFFFF' } }}
          ref={navigation => navigationHelper.setSplitSidebarNavigation(navigation)}
        >
          {MainNavigator('Home')}
        </NavigationContainer>
      </View>

      <View style={styles.contentContainer}>
        <NavigationContainer
          independent
          theme={{ colors: { background: '#FFFFFF' } }}
          ref={navigation => navigationHelper.setSplitContentNavigation(navigation)}
        >
          {MainNavigator('SplitEmptyState')}
        </NavigationContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1.618,
  },
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    borderRightColor: '#979797',
    borderRightWidth: 0.5,
    flex: 1,
  },
});
