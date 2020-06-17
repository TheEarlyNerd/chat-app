import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BabbleTextField } from './';
import { SearchIcon } from './icons';

export default class BabbleSearchField extends Component {
  textField = null;

  state = {
    search: null,
    showCancelButton: false,
  }

  _cancelPress = () => {
    this._onChangeText(null);
    this._toggleCancelButton(false);
    this.textField.blur();
  }

  _onBlur = () => {
    const { search } = this.state;

    if (!search) {
      this._toggleCancelButton(false);
    }
  }

  _onChangeText = text => {
    const { onChangeText } = this.props;

    this.setState({ search: text });

    if (onChangeText) {
      onChangeText(text);
    }
  }

  _toggleCancelButton = show => {
    this.setState({ showCancelButton: show });
  }

  render() {
    const { placeholder, containerStyle, onChangeText, disableCancelButton, style, ...additionalProps } = this.props;
    const { search, showCancelButton } = this.state;

    return (
      <View style={[ styles.container, containerStyle ]}>
        <BabbleTextField
          autoCorrect={false}
          placeholder={placeholder}
          returnKeyType={'search'}
          onFocus={() => this._toggleCancelButton(true)}
          onBlur={this._onBlur}
          onChangeText={this._onChangeText}
          value={search}
          containerStyle={styles.textFieldContainer}
          style={[ styles.textField, style ]}
          inputPrefix={(
            <SearchIcon
              width={20}
              height={20}
              style={styles.searchIcon}
            />
          )}
          small
          {...additionalProps}
          ref={component => this.textField = component}
        />

        {showCancelButton && !disableCancelButton && (
          <TouchableOpacity onPress={this._cancelPress} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  cancelButton: {
    justifyContent: 'center',
    marginLeft: 15,
  },
  cancelButtonText: {
    color: '#299BCB',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  searchIcon: {
    color: '#C7C7CC',
    marginLeft: 15,
    marginRight: 5,
  },
  textFieldContainer: {
    flex: 1,
    width: undefined,
  },
});
