import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { BabbleFieldLabel } from './';

export default class BabbleTextField extends Component {
  textInputComponent = null;

  focus = () => {
    this.textInputComponent.focus();
  }

  render() {
    const { containerStyle, label, style, error, inputPrefix, labelPostfix, ...props } = this.props;

    return (
      <View style={[ styles.container, containerStyle ]}>
        {label && (
          <BabbleFieldLabel
            containerStyle={styles.fieldLabelContainer}
            postfix={labelPostfix}
          >
            {label}
          </BabbleFieldLabel>
        )}

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

        <View style={[
          styles.shadow,
          (label) ? styles.shadowLabel : null,
          (!label) ? styles.shadowNoLabel : null,
        ]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
  fieldLabelContainer: {
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
  shadowLabel: {
    top: 50,
  },
  shadowNoLabel: {
    top: 17,
  },
  errorText: {
    position: 'absolute',
    bottom: -25,
    color: '#F53333',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
  },
});
