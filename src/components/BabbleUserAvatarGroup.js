import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BabbleUserAvatar } from './';

export default class BabbleUserAvatarGroup extends Component {
  render() {
    const { users, usersCount, size, disabled, onPress } = this.props;
    const avatarSize = (users.length > 2) ? size / 2 : size / 1.4;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.container,
          { width: size, height: size },
        ]}
      >
        <BabbleUserAvatar
          avatarAttachment={users[0]?.avatarAttachment}
          disabled
          hideStatusIcon
          size={avatarSize}
        />

        {users.length > 1 && (
          <BabbleUserAvatar
            avatarAttachment={users[1]?.avatarAttachment}
            disabled
            hideStatusIcon
            size={avatarSize}
            style={[
              (users.length === 2) ? {
                position: 'absolute',
                bottom: 0,
                right: 0,
              } : null,
            ]}
          />
        )}

        {users.length > 2 && (
          <BabbleUserAvatar
            avatarAttachment={users[2]?.avatarAttachment}
            disabled
            hideStatusIcon
            size={avatarSize}
            style={[
              (users.length === 3) ? {
                marginTop: avatarSize / 2,
              } : null,
              (users.length === 4) ? {
                paddingLeft: size - avatarSize * 2,
              } : null,
            ]}
          />
        )}

        {users.length > 3 && (
          <View style={[
            styles.countContainer,
            {
              width: avatarSize,
              height: avatarSize,
              paddingLeft: size - avatarSize * 2,
            },
          ]}>
            <Text style={styles.countText}>+{usersCount - 3}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  countContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  countText: {
    color: '#797979',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
  },
});
