import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const BabbleUserAvatar = props => (
  <View style={[
    styles.container,
    {
      width: props.size,
      height: props.size,
      borderRadius: props.size,
    },
  ]}>
    <Image
      source={props.source}
      resizeMode={'cover'}
      style={styles.image}
    />

    <View style={[
      styles.shadow,
      {
        width: props.size * 0.5,
        height: props.size * 0.25,
        shadowOffset: { width: 0, height: props.size * 0.37 },
      },
    ]} />
  </View>
);

export default BabbleUserAvatar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    //borderWidth: 2,
  //  borderColor: '#299BCB',
  },
  shadow: {
    position: 'absolute',
    zIndex: -1,
    backgroundColor: '#FFFFFF',
    shadowColor: '#252A3F',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});
