import React from 'react';
import { StyleSheet } from 'react-native';
import { BabbleTextField } from './';
import { SearchIcon } from './icons';

const BabbleSearchField = props => {
  const { placeholder, containerStyle, style, ...additionalProps } = props;

  return (
    <BabbleTextField
      placeholder={props.placeholder}
      returnKeyType={'search'}
      containerStyle={props.containerStyle}
      style={props.style}
      inputPrefix={(
        <SearchIcon
          width={20}
          height={20}
          style={styles.searchIcon}
        />
      )}
      small
      {...additionalProps}
    />
  );
};

export default BabbleSearchField;

const styles = StyleSheet.create({
  searchIcon: {
    color: '#C7C7CC',
    marginLeft: 15,
    marginRight: 5,
  },
});
