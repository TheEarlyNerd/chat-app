import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { BabbleFieldLabel } from './';

export default class BabbleTextField extends Component {
  state = {
    value: '',
  }

  textInputComponent = null;

  get value() {
    return this.state.value;
  }

  set value(value) {
    this.setState({ value });
  }

  clear = () => {
    this.setState({ value: '' });
    this.textInputComponent.clear();
  }

  focus = () => {
    this.textInputComponent.focus();
  }

  _onChangeText = text => {
    const { onChangeText } = this.props;

    this.setState({ value: text });

    if (onChangeText) {
      onChangeText(text);
    }
  }

  render() {
    const { value } = this.state;
    const { containerStyle, label, info, error, style, inputPrefix, labelPostfix, small, ...props } = this.props;

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
            onChangeText={this._onChangeText}
            style={[
              styles.textInput,
              (small) ? styles.textInputSmall : null,
              style,
            ]}
            value={value}
            ref={component => this.textInputComponent = component}
            {...props}
          />
        </View>

        {!!error && (
          <Text style={[ styles.subtext, styles.errorText ]}>{error}</Text>
        )}

        {!!info && !error && (
          <Text style={[ styles.subtext, styles.infoText ]}>{info}</Text>
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
  textInputSmall: {
    fontSize: 16,
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
  subtext: {
    position: 'absolute',
    bottom: -25,
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
  },
  infoText: {
    color: '#9B9B9B',
  },
  errorText: {
    color: '#F53333',
  },
});
