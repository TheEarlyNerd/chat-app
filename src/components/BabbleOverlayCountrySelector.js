import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Text, Keyboard, Animated, StyleSheet } from 'react-native';
import { BabbleButton } from '../components';
import countries from '../data/countries';
import maestro from '../maestro';

export default class BabbleOverlayCountrySelector extends Component {
  state = {
    opacityAnimated: new Animated.Value(0),
  }

  componentDidMount() {
    this._show();
  }

  _show = () => {
    Keyboard.dismiss();

    this._toggle(true);
  };

  _hide = () => {
    this._toggle(false).then(() => {
      maestro.dispatchEvent('OVERLAYS:HIDE', { name: 'CountrySelector' });
    });
  }

  _toggle = show => {
    return new Promise(resolve => {
      Animated.timing(this.state.opacityAnimated, {
        toValue: (show) ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  _onCountrySelected = country => {
    const { onCountrySelected } = this.props.data;

    if (onCountrySelected) {
      onCountrySelected(country);
    }

    this._hide();
  }

  _selectorRenderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this._onCountrySelected(item)} style={styles.countryButton}>
        <Text style={styles.countryButtonText}>{item.text}</Text>
      </TouchableOpacity>
    );
  }

  _selectorItemSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  }

  render() {
    return (
      <Animated.View style={[ styles.container, { opacity: this.state.opacityAnimated } ]}>
        <View style={styles.countryListContainer}>
          <FlatList
            data={countries}
            renderItem={this._selectorRenderItem}
            ItemSeparatorComponent={this._selectorItemSeparator}
            keyExtractor={country => country.countryCode}
            keyboardShouldPersistTaps={'always'}
            style={styles.countryList}
          />

          <BabbleButton onPress={this._hide} style={styles.closeButton}>Cancel</BabbleButton>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 99,
  },
  countryListContainer: {
    width: '85%',
    height: '60%',
    borderRadius: 4,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 100,
  },
  countryList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginBottom: 30,
  },
  countryButton: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  countryButtonText: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 18,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#E1E3E8',
  },
  closeButton: {
    marginBottom: 50,
  },
});
