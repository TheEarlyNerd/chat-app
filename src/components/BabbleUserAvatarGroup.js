import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const defaultAvatar = require('../assets/images/default-avatar.png');

export default class BabbleUserAvatarGroup extends Component {
  render() {
    const { users, size } = this.props;

    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            borderRadius: size / 2,
            height: size,
            width: size,
          },
        ]}
      >
        <View style={[ styles.innerContainer, { borderRadius: size / 2 } ]}>
          <View style={styles.images}>
            <FastImage
              resizeMode={'cover'}
              source={(users[0].avatarAttachment) ? { uri: users[0].avatarAttachment.url } : defaultAvatar}
              style={[
                styles.image,
                (users.length === 2) ? { width: '100%' } : null,
              ]}
            />

            {users.length > 2 && (
              <FastImage
                resizeMode={'cover'}
                source={(users[2].avatarAttachment) ? { uri: users[2].avatarAttachment.url } : defaultAvatar}
                style={styles.image}
              />
            )}
          </View>

          <View style={styles.images}>
            <FastImage
              resizeMode={'cover'}
              source={(users[1].avatarAttachment) ? { uri: users[1].avatarAttachment.url } : defaultAvatar}
              style={[
                styles.image,
                ([ 2, 3 ].includes(users.length)) ? { width: '100%' } : null,
              ]}
            />

            {users.length > 3 && (
              <View style={[ styles.image, styles.groupMoreContainer ]}>
                <Text style={styles.text}>+{users.length - 3}</Text>

                <LinearGradient
                  useAngle
                  angle={36}
                  colors={[ '#299BCB', '#1ACCB4' ]}
                  locations={[ 0, 0.6 ]}
                  style={styles.groupMoreBackground}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flexWrap: 'wrap',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  groupMoreBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  groupMoreContainer: {
    alignItems: 'center',
    backgroundColor: '#1ACCB4',
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '50%',
  },
  images: {
    flexDirection: 'row',
    height: '50%',
    overflow: 'hidden',
    width: '100%',
  },
  innerContainer: {
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 12,
    marginLeft: -4,
    marginTop: -4,
  },
});
