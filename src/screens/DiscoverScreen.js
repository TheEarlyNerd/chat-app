import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

export default class ExploreScreen extends Component {
  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.headerText}>Discover</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 25,
    paddingTop: 40,
  },
  headerText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Black',
    fontSize: 26,
    paddingHorizontal: 15,
  },
});
