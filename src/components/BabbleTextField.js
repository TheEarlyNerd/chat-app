import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default class BabbleTextField extends Component {
  render() {
    const { containerStyle, style, ...props } = this.props;

    return (
      <View style={[ styles.container, containerStyle ]}>
        <Text style={styles.labelText}>Enter your phone number</Text>

        <View style={styles.textInputContainer}>
          <TextInput
            placeholderColor={'#909090'}
            style={[ styles.textInput, style ]}
            {...props}
          />
        </View>

        <View style={styles.shadow} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textInputContainer: {
    backgroundColor: '#F2F8FC',
    borderWidth: 0.5,
    borderColor: '#E1E3E8',
    borderRadius: 4,
  },
  labelText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 18,
    paddingTop: 2,
    paddingHorizontal: 10,
    height: 46,
  },
  shadow: {
    position: 'absolute',
    top: 50,
    bottom: 0,
    left: '5%',
    right: '5%',
    zIndex: -2,
    backgroundColor: '#FFF',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
});
