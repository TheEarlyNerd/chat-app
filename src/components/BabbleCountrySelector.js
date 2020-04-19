import React, { Component } from 'react';
import { TouchableOpacity, FlatList, View, Text, Animated, StyleSheet } from 'react-native';
import { getCountry } from 'react-native-localize';
import countries from '../data/countries';

const deviceCountry = getCountry();

export default class BabbleCountrySelectorButton extends Component {
  state = {
    country: countries.find(country => country.countryCode === deviceCountry),
    selectorOpen: false,
    selectorOverlayOpacityAnimated: new Animated.Value(0),
  }

  toggleSelector = show => {
    const { selectorOverlayOpacityAnimated } = this.state;

    if (show) {
      this.setState({ selectorOpen: true });
    }

    Animated.timing(selectorOverlayOpacityAnimated, {
      toValue: (show) ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (!show) {
        this.setState({ selectorOpen: false });
      }
    });
  }

  // maestro event for screen tap to hide?

  _countrySelected = country => {
    this.setState({ country });
    this.toggleSelector();
  }

  _selectorRenderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this._countrySelected(item)} style={styles.selectorCountryButton}>
        <Text style={styles.selectorCountryButtonText}>{item.text}</Text>
      </TouchableOpacity>
    );
  }

  _selectorItemSeparator = () => {
    return (
      <View style={styles.selectorSeparator} />
    );
  }

  render() {
    const { style } = this.props;
    const { country, selectorOpen, selectorOverlayOpacityAnimated } = this.state;

    return (
      <>
        <TouchableOpacity onPress={() => this.toggleSelector(!selectorOpen)} style={style}>
          <Text style={styles.buttonText}>{country.emoji} +{country.phoneCode}</Text>
        </TouchableOpacity>

        {selectorOpen && (
          <Animated.View style={[ styles.selectorOverlay, { opacity: selectorOverlayOpacityAnimated } ]}>
            <FlatList
              data={countries}
              renderItem={this._selectorRenderItem}
              ItemSeparatorComponent={this._selectorItemSeparator}
              keyExtractor={country => country.countryCode}
              keyboardShouldPersistTaps={'always'}
              style={styles.selectorList}
            />

            <View style={styles.selectorCarat} />
          </Animated.View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  selectorOverlay: {
    position: 'absolute',
    bottom: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    width: '100%',
    height: 300,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 200,
  },
  selectorList: {
    borderRadius: 4,
  },
  selectorCountryButton: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  selectorCountryButtonText: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 18,
  },
  selectorSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#E1E3E8',
  },
  selectorCarat: {
    width: 30,
    height: 30,
    backgroundColor: '#FFFFFF',
    transform: [ { rotate: '45deg' } ],
    zIndex: -2,
    position: 'absolute',
    bottom: -8,
    left: 7,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderRadius: 2,
  },
  buttonText: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 18,
  },
});
