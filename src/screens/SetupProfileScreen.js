import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { BabbleTextField, BabbleUsernameField, BabbleButton, BabbleTiledIconsBackground, BabbleUserAvatar } from '../components';
import { SmileIcon, CameraIcon } from '../components/icons';
import maestro from '../maestro';

const { interfaceHelper } = maestro.helpers;

export default class SetupProfileScreen extends Component {
  state = {
    name: null,
    username: null,
  }

  _selectAvatarImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
      });

      console.log(image);
    } catch (error) {
      interfaceHelper.showError({ message: error.message });
    }
  }

  render() {
    const { name, username } = this.state;

    return (
      <KeyboardAwareScrollView contentContainerStyle={{ minHeight: Dimensions.get('window').height }}>
        <View style={styles.previewContainer}>
          <BabbleUserAvatar
            onPress={this._selectAvatarImage}
            hideActivityIcon
            source={require('../assets/images/upload-photo-placeholder.png')}
            size={150}
            style={styles.avatar}
          />

          {!!name && (
            <Text style={[ styles.previewText, styles.previewNameText ]}>{name}</Text>
          )}

          {!!username && (
            <Text style={[ styles.previewText, styles.previewUsernameText ]}>@{username}</Text>
          )}

          <BabbleTiledIconsBackground
            iconComponents={[ SmileIcon, CameraIcon ]}
            iconSize={20}
            iconStyle={{ color: '#FFFFFF', opacity: 0.25 }}
            iconSpacing={37}
            linearGradientProps={{
              colors: [ '#299BCB', '#1ACCB4' ],
              locations: [ 0, 0.7 ],
              useAngle: true,
              angle: 36,
            }}
            style={styles.backgroundGradient}
          />
        </View>

        <View style={styles.formContainer}>
          <BabbleTextField
            label={'Name'}
            returnKeyType={'next'}
            onChangeText={text => this.setState({ name: text })}
            containerStyle={styles.fieldContainer}
            value={name}
          />

          <BabbleUsernameField
            label={'Username'}
            returnKeyType={'done'}
            onChangeText={text => this.setState({ username: text })}
            info={'You can always change this later.'}
            containerStyle={styles.lastFieldContainer}
            value={username}
          />

          <BabbleButton
            disabled
          >
            Continue
          </BabbleButton>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    marginBottom: 10,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  fieldContainer: {
    marginBottom: 35,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  lastFieldContainer: {
    marginBottom: 50,
  },
  previewContainer: {
    alignItems: 'center',
    height: Dimensions.get('window').height / 2.2,
    justifyContent: 'center',
  },
  previewNameText: {
    fontSize: 22,
  },
  previewText: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans-Bold',
    shadowColor: '#252A3F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  previewUsernameText: {
    fontSize: 18,
  },
});
