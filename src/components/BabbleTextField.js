import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default class BabbleTextField extends Component {
  textInputComponent = null;

  focus = () => {
    this.textInputComponent.focus();
  }

  render() {
    const { containerStyle, style, error, inputPrefix, labelPostfix, ...props } = this.props;

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
            ref={component => this.textInputComponent = component}
            {...props}
          />
        </View>

        {typeof error === 'string' && error.length > 0 && (
          <Text style={styles.errorText}>{error}</Text>
        )}

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
    fontSize: 18,
    marginBottom: 8,
  },
  textInput: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 24,
    paddingTop: 2,
    paddingHorizontal: 10,
    height: 50,
    width: '100%',
  },
  shadow: {
    position: 'absolute',
    top: 50,
    height: 35,
    left: '5%',
    right: '5%',
    zIndex: -2,
    backgroundColor: '#FFF',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  errorText: {
    position: 'absolute',
    bottom: -25,
    color: '#F53333',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
  },
});
