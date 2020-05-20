import React, { Component } from 'react';
import { KeyboardAvoidingView, View, TextInput, Image, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { HeaderHeightContext } from '@react-navigation/stack';
import ImagePicker from 'react-native-image-crop-picker';
import { BabbleConversationMessageComposerToolbarAttachment } from './';
import { FileTextIcon, CameraIcon, ArrowUpIcon, ImageIcon } from './icons';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class BabbleMessageComposerToolbar extends Component {
  state = {
    text: '',
    attachments: [],
  }

  clear() {
    this.setState({
      text: '',
      attachments: [],
    });
  }

  _showAttachmentsActionSheet = () => {
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
          {
            iconComponent: FileTextIcon,
            text: 'Open Files',
          },
        ],
      },
    });
  }

  _showGifSelector = () => {
    interfaceHelper.showOverlay({
      name: 'GifSelector',
      data: { onGifPress: this._gifPressed },
    });
  }

  _gifPressed = gif => {
    const { onSubmit } = this.props;

    onSubmit({ text: gif.images.original.url });
  }

  _selectMedia = async source => {
    const options = {
      maxFiles: 25,
      multiple: true,
    };

    try {
      const media = (source === 'camera')
        ? await ImagePicker.openCamera(options)
        : await ImagePicker.openPicker(options);

      const newAttachments = media.map(item => ({
        filename: item.filename,
        bytes: item.size,
        url: item.path,
        mimetype: item.mime,
        optimistic: true,
      }));

      const filteredAttachments = this.state.attachments.filter(attachment => {
        return !newAttachments.some(newAttachment => {
          return (
            newAttachment.filename === attachment.filename &&
            newAttachment.bytes === attachment.bytes
          );
        });
      });

      this.setState({ attachments: [ ...newAttachments, ...filteredAttachments ] });
    } catch { /* noop */ }
  }

  render() {
    const { onSubmit, style } = this.props;
    const { text, attachments } = this.state;

    return (
      <HeaderHeightContext.Consumer>
        {headerHeight => (
          <KeyboardAvoidingView
            behavior={'padding'}
            keyboardVerticalOffset={headerHeight + styles.container.paddingVertical}
            style={[ styles.container, style ]}
          >
            <TouchableOpacity
              onPress={this._showAttachmentsActionSheet}
              style={[ styles.button, styles.leftButton ]}
            >
              <ImageIcon
                width={22}
                height={22}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._showGifSelector}
              style={[ styles.button, styles.leftButton ]}
            >
              <Text style={styles.buttonText}>GIF</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              {!!attachments?.length && (
                <ScrollView
                  horizontal
                  style={styles.attachmentsScrollView}
                >
                  {attachments.map((attachment, index) => (
                    <BabbleConversationMessageComposerToolbarAttachment
                      attachment={attachment}
                      style={styles.attachment}
                      key={`${attachment.filename}-${attachment.bytes}`}
                    />
                  ))}
                </ScrollView>
              )}

              <TextInput
                multiline
                placeholderColor={'#909090'}
                placeholder={'Message...'}
                onChangeText={text => this.setState({ text })}
                value={text}
                style={styles.textInput}
              />
            </View>

            <TouchableOpacity
              onPress={() => onSubmit({ text, attachments })}
              disabled={!text.length && !attachments?.length}
              style={styles.sendButton}
            >
              <ArrowUpIcon
                width={21}
                height={21}
                style={[
                  styles.buttonIcon,
                  (!text.length && !attachments?.length) ? styles.buttonIconDisabled : null,
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
  attachment: {
    marginHorizontal: 5,
  },
  attachmentsScrollView: {
    marginHorizontal: 5,
    marginTop: 10,
  },
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
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E3E8',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
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
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    maxHeight: 120,
    minHeight: 35,
    paddingBottom: 8,
    paddingHorizontal: 15,
    paddingTop: 8,
  },
});
