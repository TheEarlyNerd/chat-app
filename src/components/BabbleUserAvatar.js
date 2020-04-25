import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';

const BabbleUserAvatar = props => (
  <TouchableOpacity
    style={[
      styles.container,
      props.style,
    ]}
  >
    <Image
      source={props.source}
      resizeMode={'cover'}
      style={[
        styles.image,
        {
          width: props.size,
          height: props.size,
          borderRadius: props.size,
        },
        props.imageStyle,
      ]}
    />

    <View style={styles.activityIcon} />
  </TouchableOpacity>
);

export default BabbleUserAvatar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  activityIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#1FD7CB',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
