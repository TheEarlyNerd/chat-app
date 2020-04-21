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

  render() {
    const { containerStyle, style, error } = this.props;
    const { country } = this.state;

    return (
      <BabbleTextField
        placeholder={'(201) 867-5309'}
        onChangeText={phone => this.setState({ phone })}
        returnKeyType={'done'}
        keyboardType={'phone-pad'}
        containerStyle={containerStyle}
        inputPrefix={(
          <TouchableOpacity onPress={this._showCountrySelector} style={styles.prefixButton}>
            <Text style={styles.prefixButtonText}>{country.emoji} +{country.phoneCode}</Text>
          </TouchableOpacity>
        )}
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
