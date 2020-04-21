import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AsYouType } from 'libphonenumber-js';
import { getCountry } from 'react-native-localize';
import { BabbleTextField } from './';
import countries from '../data/countries';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class BabblePhoneField extends Component {
  state = {
    country: countries.find(country => country.countryCode === getCountry()),
    phone: '',
  }

  _showCountrySelector = () => {
    interfaceHelper.showOverlay({
      name: 'CountrySelector',
      data: {
        onSelectedCountry: country => this.setState({ country }),
      },
    });
  }

  _onTextInput = ({ nativeEvent }) => {
    const { text, range } = nativeEvent;
    const { phone } = this.state;

    if (text === '' && phone.length > 0) {
      this.setState({ phone: phone.slice(0, range.start - range.end) });
    } else {
      this.setState({ phone: `${phone}${text}` });
    }
  }

  _formatPhoneNumber = phoneNumber => {
    const { phoneCode } = this.state.country;

    try {
      const formatter = new AsYouType({ defaultCallingCode: phoneCode });

      return formatter.input(`${phoneCode}${phoneNumber}`).replace(' ', '').slice(phoneCode.length);
    } catch (error) {
      // formatter doesn't recognize all phone codes and can throw.
      return phoneNumber;
    }
  }

  render() {
    const { containerStyle, style, error } = this.props;
    const { country, phone } = this.state;

    return (
      <BabbleTextField
        label={'Enter your phone number'}
        placeholder={this._formatPhoneNumber('2018675309')}
        onTextInput={this._onTextInput}
        returnKeyType={'done'}
        keyboardType={'phone-pad'}
        containerStyle={containerStyle}
        inputPrefix={(
          <TouchableOpacity onPress={this._showCountrySelector} style={styles.prefixButton}>
            <Text style={styles.prefixButtonText}>{country.emoji} +{country.phoneCode}</Text>
          </TouchableOpacity>
        )}
        value={this._formatPhoneNumber(phone)}
        error={error}
        style={style}
      />
    );
  }
}

const styles = StyleSheet.create({
  prefixButton: {
    marginLeft: 10,
    marginTop: 1,
  },
  prefixButtonText: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 24,
  },
});
