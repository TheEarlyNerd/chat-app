import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowUpIcon, ImageIcon } from './icons';

export default class BabbleMessageComposerToolbar extends Component {
  state = {
    text: '',
  }

  render() {
    const { style } = this.props;
    const { text } = this.state;

    return (
      <View style={[ styles.container, style ]}>
        <TouchableOpacity style={[ styles.button, styles.leftButton ]}>
          <ImageIcon
            width={22}
            height={22}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[ styles.button, styles.leftButton ]}>
          <Text style={styles.buttonText}>GIF</Text>
        </TouchableOpacity>

        <TextInput
          multiline
          placeholderColor={'#909090'}
          placeholder={'Message...'}
          onChangeText={text => this.setState({ text })}
          style={styles.textInput}
        />

        <TouchableOpacity disabled={!text.length} style={styles.sendButton}>
          <ArrowUpIcon
            width={21}
            height={21}
            style={[
              styles.buttonIcon,
              (!text.length) ? styles.buttonIconDisabled : null,
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 30,
  },
  buttonIcon: {
    color: '#2A99CC',
  },
  buttonIconDisabled: {
    color: '#9B9B9B',
  },
  buttonText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 14,
  },
  container: {
    alignItems: 'center',
    borderTopColor: '#D8D8D8',
    borderTopWidth: 0.5,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  leftButton: {
    marginRight: 15,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 35,
    justifyContent: 'center',
    marginLeft: 15,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: 35,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E3E8',
    borderRadius: 20,
    borderWidth: 1,
    color: '#323643',
    flex: 1,
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    maxHeight: 120,
    minHeight: 35,
    paddingBottom: 8,
    paddingHorizontal: 15,
    paddingTop: 8,
  },
});