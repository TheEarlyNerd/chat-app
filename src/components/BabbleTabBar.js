import React, { Component } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeIcon, MessageCircleIcon } from './icons';

export default class BabbleTabBar extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabBarButton}>
            <View style={styles.tabBarButtonIconContainer}>
              <HomeIcon width={30} height={30} style={[ styles.tabBarIcon, styles.tabBarIconActive ]} />

              {false && (
                <View style={styles.alertIcon} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBarButton}>
            <View style={styles.tabBarButtonIconContainer}>
              <MessageCircleIcon width={30} height={30} style={styles.tabBarIcon} />

              {false && (
                <View style={styles.alertIcon} />
              )}
            </View>

          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  alertIcon: {
    backgroundColor: '#FF0000',
    borderColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
    zIndex: 1,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  tabBar: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-around',
  },
  tabBarButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabBarButtonIconContainer: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 30,
  },
  tabBarIcon: {
    color: '#979797',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
  },
  tabBarIconActive: {
    color: '#2A99CC',
  },
});
