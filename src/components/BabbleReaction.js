import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default class BabbleReaction extends Component {
  render() {
    const { reaction, count, style } = this.props;

    return (
      <TouchableOpacity style={[ styles.container, style ]}>
        <Text style={styles.reactionText}>{reaction}</Text>
        <Text style={styles.countText}>{count}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F1F2F6',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 2,
    paddingHorizontal: 4,
    paddingTop: 3,
  },
  countText: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
    marginLeft: 3,
  },
  reactionText: {
    color: '#000000',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    lineHeight: 17,
  },
});
