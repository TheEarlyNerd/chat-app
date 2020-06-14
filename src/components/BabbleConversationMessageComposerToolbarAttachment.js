import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleAutoscaleImage } from './'
import { XIcon } from './icons';

export default class BabbleConversationMessageComposerToolbarAttachment extends Component {
  render() {
    const { attachment, onPress, onDeletePress, style } = this.props;

    return (
      <TouchableOpacity
        onPress={() => onPress(attachment)}
        style={style}
      >
        <BabbleAutoscaleImage
          resizeMode={'contain'}
          minHeight={60}
          maxHeight={60}
          source={{ uri: attachment.url }}
          style={styles.image}
        />

        <TouchableOpacity
          onPress={() => onDeletePress(attachment)}
          style={styles.deleteButton}
        >
          <XIcon
            width={14}
            height={14}
            style={styles.deleteButtonIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#404040',
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    top: 4,
    width: 18,
  },
  deleteButtonIcon: {
    color: '#FFFFFF',
  },
  image: {
    borderRadius: 4,
  },
});
