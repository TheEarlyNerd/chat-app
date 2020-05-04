import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';

const BabbleUserAvatar = props => (
  <TouchableOpacity
    onPress={props.onPress}
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

    {!props.hideActivityIcon && (
      <View style={[ styles.activityIcon, props.activityIconStyle ]} />
    )}
  </TouchableOpacity>
);

export default BabbleUserAvatar;

const styles = StyleSheet.create({
  activityIcon: {
    backgroundColor: '#1FD7CB',
    borderColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
