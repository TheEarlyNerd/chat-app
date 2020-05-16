import React, { Component } from 'react';
import { KeyboardAvoidingView, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HeaderHeightContext } from '@react-navigation/stack';
import ImagePicker from 'react-native-image-crop-picker';
import { CameraIcon, ArrowUpIcon, ImageIcon } from './icons';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class BabbleMessageComposerToolbar extends Component {
  state = {
    text: '',
    selectedMedia: [],
  }

  clear() {
    this.setState({
      text: '',
      selectedMedia: [],
    });
  }

  _showMediaActionSheet = () => {
    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: {
        actions: [
          {
            iconComponent: CameraIcon,
            text: 'Open Camera',
            onPress: () => this._selectMedia('camera'),
          },
          {
            iconComponent: ImageIcon,
            text: 'Open Photo Library',
            onPress: () => this._selectMedia('library'),
          },
        ],
      },
    });
  }

  _selectMedia = async source => {
    const options = { multiple: true };
    try {
      const media = (source === 'camera')
        ? await ImagePicker.openCamera(options)
        : await ImagePicker.openPicker(options);

      console.log(media);
    } catch { /* noop */ }
  }

  render() {
    const { onSubmit, style } = this.props;
    const { text, selectedMedia } = this.state;

    return (
      <HeaderHeightContext.Consumer>
        {headerHeight => (
          <KeyboardAvoidingView
            behavior={'padding'}
            keyboardVerticalOffset={headerHeight + styles.container.paddingVertical}
            style={[ styles.container, style ]}
          >
            <TouchableOpacity
              onPress={this._showMediaActionSheet}
              style={[ styles.button, styles.leftButton ]}
            >
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
              value={text}
              style={styles.textInput}
            />

            <TouchableOpacity
              onPress={() => onSubmit({ text, selectedMedia })}
              disabled={!text.length}
              style={styles.sendButton}
            >
              <ArrowUpIcon
                width={21}
                height={21}
                style={[
                  styles.buttonIcon,
                  (!text.length) ? styles.buttonIconDisabled : null,
                ]}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </HeaderHeightContext.Consumer>
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
