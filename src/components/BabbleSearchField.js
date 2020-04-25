import React from 'react';
import { StyleSheet } from 'react-native';
import { BabbleTextField } from './';
import { SearchIcon } from './icons';

const BabbleSearchField = props => (
  <BabbleTextField
    placeholder={props.placeholder}
    returnKeyType={'search'}
    containerStyle={props.containerStyle}
    style={[ styles.textInput, props.style ]}
    inputPrefix={(
      <SearchIcon
        width={20}
        height={20}
        style={styles.searchIcon}
      />
    )}
  />
);

export default BabbleSearchField;

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 15,
    marginRight: 5,
    color: '#C7C7CC',
  },
});
