import React, { Component } from 'react';
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native';

export default class BabbleSettingField extends Component {
  textInput = null;

  state = {
    editing: false,
  }

  _settingPress = () => {
    const { editable, onPress } = this.props;

    if (onPress) {
      onPress();
    }

    if (this.textInput) {
      this.textInput.focus();
    }

    if (editable) {
      this.setState({ editing: true });
    }
  }

  render() {
    const { label, labelStyle, editable, placeholder, IconComponent, iconStyle, valuePrefix, maxLength, onPress, style, value, children, ...props } = this.props;
    const { editing } = this.state;

    return (
      <TouchableOpacity
        disabled={!onPress && !editable}
        onPress={this._settingPress}
        style={[ styles.container, style ]}
      >
        <View style={styles.settingContainer}>
          <View style={styles.headingContainer}>
            <Text style={[ styles.labelText, labelStyle ]}>{label}</Text>

            {editable && !editing && (
              <Text style={styles.editText}>Edit</Text>
            )}

            {!!IconComponent && (
              <IconComponent
                width={24}
                height={24}
                style={[ styles.icon, iconStyle ]}
              />
            )}
          </View>

          <View style={styles.valueContainer}>
            {!!valuePrefix && (
              <Text style={styles.valueText}>{valuePrefix}</Text>
            )}

            {(value || placeholder) && !editing && (
              <Text style={styles.valueText}>{value || placeholder}</Text>
            )}

            <View style={styles.inputContainer}>
              {editing && (
                <TextInput
                  autoFocus
                  placeholder={placeholder}
                  maxLength={maxLength}
                  value={value}
                  style={styles.textInput}
                  ref={component => this.textInput = component}
                  {...props}
                />
              )}

              {editing && !!maxLength && (
                <Text style={styles.lengthText}>{(value) ? value.length : 0} / {maxLength}</Text>
              )}

              {children}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    width: '100%',
  },
  editText: {
    color: '#40A1D5',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    color: '#ADADAD',
  },
  inputContainer: {
    flex: 1,
  },
  labelText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
  },
  lengthText: {
    color: '#ADADAD',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
    textAlign: 'right',
    width: '100%',
  },
  settingContainer: {
    flex: 1,
  },
  textInput: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    marginTop: 5,
    width: '100%',
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  valueText: {
    color: '#ADADAD',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    marginTop: 5,
  },
});
