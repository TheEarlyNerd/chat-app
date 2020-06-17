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
    this._onChangeText('');
  }

  focus = () => {
    this.textInputComponent.focus();
  }

  blur = () => {
    this.textInputComponent.blur();
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
    const { containerStyle, label, info, error, style, inputPrefix, labelPostfix, onChangeText, small, ...props } = this.props;

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
            placeholderTextColor={'#909090'}
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
  errorText: {
    color: '#F53333',
  },
  fieldLabelContainer: {
    marginBottom: 8,
  },
  infoText: {
    color: '#9B9B9B',
  },
  shadow: {
    backgroundColor: '#FFF',
    height: 35,
    left: '5%',
    position: 'absolute',
    right: '5%',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: -2,
  },
  shadowLabel: {
    top: 50,
  },
  shadowNoLabel: {
    top: 17,
  },
  subtext: {
    bottom: -25,
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
    position: 'absolute',
  },
  textInput: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 24,
    height: 50,
    paddingHorizontal: 10,
    paddingTop: 2,
    width: '100%',
  },
  textInputContainer: {
    alignItems: 'center',
    backgroundColor: '#F1F7FB',
    borderColor: '#E1E3E8',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
  },
  textInputSmall: {
    fontSize: 16,
  },
});
