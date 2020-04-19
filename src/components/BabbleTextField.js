import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { InfoIcon } from '../components/icons';

export default class BabbleTextField extends Component {
  render() {
    const { containerStyle, style, inputPrefix, labelPostfix, ...props } = this.props;

    return (
      <View style={[ styles.container, containerStyle ]}>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Enter your phone number</Text>
          {labelPostfix}
        </View>

        <View style={styles.textInputContainer}>
          {inputPrefix}

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
  labelContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F7FB',
    borderWidth: 1,
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
    width: '100%',
  },
  shadow: {
    position: 'absolute',
    top: 50,
    bottom: 1,
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
