import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class BabbleTiledBackground extends Component {
  render() {
    const { linearGradientProps, style, ...props } = this.props;

    return (
      <View style={style} {...props}>
        {linearGradientProps && (
          <LinearGradient {...linearGradientProps} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
