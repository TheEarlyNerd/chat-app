import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class BabbleReaction extends Component {
  render() {
    const { reaction, count, style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <Text style={styles.reactionText}>{reaction}</Text>
        <Text style={styles.countText}>{count}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F2F6',
    paddingTop: 3,
    paddingBottom: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  reactionText: {
    color: '#000000',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    lineHeight: 17,
  },
  countText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
    marginLeft: 3,
  },
});
