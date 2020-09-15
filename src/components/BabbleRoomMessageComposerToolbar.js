import React, { Component } from 'react';
import { View, TextInput, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { BabbleRoomMessageComposerToolbarAttachment } from './';
import { CameraIcon, ArrowUpIcon, ImageIcon, VideoIcon, XIcon } from './icons';
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
            text: 'Take Photo',
            onPress: () => this._selectMedia('photo'),
          },
          {
            iconComponent: VideoIcon,
            text: 'Record Video',
            onPress: () => this._selectMedia('video'),
          },
          {
            iconComponent: ImageIcon,
            text: 'Media Library',
            onPress: () => this._selectMedia('library'),
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

    onSubmit({
      text: gif.images.original.url,
      embeds: [
        {
          url: gif.images.original.url,
          imageUrl: gif.images.original.url,
          mimetype: 'image/gif',
        },
      ],
    });
  }

  _selectMedia = async source => {
    const options = {
      mediaType: (source === 'video') ? 'video' : 'any',
      maxFiles: 15,
      multiple: true,
    };

    try {
      let media = (source !== 'library')
        ? await ImagePicker.openCamera(options)
        : await ImagePicker.openPicker(options);

      if (source !== 'library') {
        media = [ media ];
      }

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
    } catch (error) {
      interfaceHelper.showError({ message: error.message });
    }
  }

  _deleteAttachment = attachmentIndex => {
    const { attachments } = this.state;

    this.setState({
      attachments: attachments.filter((attachment, index) => (
        index !== attachmentIndex
      )),
    });
  }

  _openAttachment = attachmentIndex => {
    const { attachments } = this.state;

    interfaceHelper.showOverlay({
      name: 'MediaViewer',
      data: {
        media: attachments,
        selectedIndex: attachmentIndex,
        uploadPreview: true,
      },
    });
  }

  _onChangeText = text => {
    const { onTyping } = this.props;

    if (onTyping) {
      onTyping();
    }

    this.setState({ text });
  }

  render() {
    const { onSubmit, loading, style } = this.props;
    const { text, attachments } = this.state;
    return (
      <View style={[ styles.container, style ]}>
        {false && (/* TODO: Add support for replies. */
          <View style={styles.reply}>
            <Text style={styles.replyTitleText}>Replying to <Text style={styles.replyTitleNameText}>Lang Spay</Text></Text>
            <Text numberOfLines={3} style={styles.replyMessageText}>I'm baby drinking vinegar yuccie prism irony raclette organic ennui taxidermy art party flexitarian chicharrones typewriter. Pork belly vexillologist helvetica kombucha freegan succulents. Poutine photo booth disrupt readymade chambray craft beer authentic pork belly adaptogen retro sustainable. Lumbersexual gochujang waistcoat, photo booth hell of church-key portland raw denim.</Text>

            <TouchableOpacity style={styles.replyCancelButton}>
              <XIcon
                width={22}
                height={22}
                style={styles.replyCancelIcon}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={this._showAttachmentsActionSheet}
            style={[ styles.button, styles.leftButton ]}
          >
            <ImageIcon
              width={interfaceHelper.deviceValue({ default: 22, lg: 25 })}
              height={interfaceHelper.deviceValue({ default: 22, lg: 25 })}
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
                  <BabbleRoomMessageComposerToolbarAttachment
                    attachment={attachment}
                    editable={!loading}
                    onDeletePress={() => this._deleteAttachment(index)}
                    onPress={() => this._openAttachment(index)}
                    style={styles.attachment}
                    key={`${attachment.filename}-${attachment.bytes}`}
                  />
                ))}
              </ScrollView>
            )}

            <TextInput
              multiline
              placeholderColor={'#909090'}
              placeholder={'Say something...'}
              onChangeText={this._onChangeText}
              editable={!loading}
              value={text}
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity
            onPress={() => onSubmit({ text, attachments })}
            disabled={loading || (!text.length && !attachments?.length)}
            style={styles.sendButton}
          >
            {loading && (
              <ActivityIndicator color={'#2A99CC'} />
            )}

            {!loading && (
              <ArrowUpIcon
                width={interfaceHelper.deviceValue({ default: 21, lg: 24 })}
                height={interfaceHelper.deviceValue({ default: 21, lg: 24 })}
                style={[
                  styles.buttonIcon,
                  (!text.length && !attachments?.length) ? styles.buttonIconDisabled : null,
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 17 }),
  },
  container: {
    borderTopColor: '#D8D8D8',
    borderTopWidth: 0.5,
    paddingHorizontal: 15,
    paddingTop: interfaceHelper.deviceValue({ default: 10, lg: 14 }),
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
  reply: {
    marginBottom: 10,
  },
  replyCancelButton: {
    position: 'absolute',
    right: 8,
  },
  replyCancelIcon: {
    color: '#2A99CC',
  },
  replyMessageText: {
    color: '#797979',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 16 }),
    marginRight: 8,
  },
  replyTitleNameText: {
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 16 }),
  },
  replyTitleText: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 16 }),
    marginBottom: 2,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: interfaceHelper.deviceValue({ default: 35, lg: 40 }),
    justifyContent: 'center',
    marginLeft: 15,
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: interfaceHelper.deviceValue({ default: 35, lg: 40 }),
  },
  textInput: {
    color: '#323643',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 16, lg: 17 }),
    maxHeight: 120,
    minHeight: interfaceHelper.deviceValue({ default: 35, lg: 40 }),
    paddingBottom: 8,
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
