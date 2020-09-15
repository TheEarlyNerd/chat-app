import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { EditIcon } from './icons';

export default class BabbleUserAvatar extends Component {
  render() {
    const {
      avatarAttachment,
      lastActiveAt,
      onPress,
      size,
      showEditIcon,
      hideStatusIcon,
      statusIconStyle,
      editIconStyle,
      disabled,
      imageStyle,
      style,
    } = this.props;
    const defaultAvatar = this.props.defaultAvatar || require('../assets/images/default-avatar.png');
    const lastActiveThreshold = 5 * 60 * 1000; // 5 minutes

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container,
          style,
        ]}
        disabled={disabled}
      >
        <FastImage
          source={(avatarAttachment) ? { uri: avatarAttachment.url } : defaultAvatar}
          resizeMode={'cover'}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size,
            },
            imageStyle,
          ]}
        />

        {showEditIcon && (
          <View style={styles.editIconContainer}>
            <EditIcon
              width={17}
              height={17}
              style={[ styles.editIcon, editIconStyle ]}
            />
          </View>
        )}

        {!hideStatusIcon && (
          <View
            style={[
              styles.statusIcon,
              (new Date() - lastActiveAt < lastActiveThreshold) ? styles.statusIconActive : styles.statusIconInactive,
              statusIconStyle,
            ]}
          />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 1,
  },
  editIcon: {
    color: '#2A99CC',
  },
  editIconContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    bottom: 5,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 5,
    width: 30,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  statusIcon: {
    borderColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
  },
  statusIconActive: {
    backgroundColor: '#1FD7CB',
  },
  statusIconInactive: {
    backgroundColor: '#B2B2B2',
  },
});
