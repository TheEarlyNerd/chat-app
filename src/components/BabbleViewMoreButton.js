import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BabbleViewMoreButton = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[ styles.button, props.style ]}
    >
      <Text style={styles.text}>View More</Text>
    </TouchableOpacity>
  );
};

export default BabbleViewMoreButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    borderColor: '#E8E8E8',
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 35,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    alignSelf: 'center',
    color: '#9B9B9B',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
});
