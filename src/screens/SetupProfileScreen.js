import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BabbleTextField, BabbleUsernameField, BabbleButton, BabbleBackground, BabbleUserAvatar } from '../components';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { attachmentsHelper, interfaceHelper, navigationHelper } = maestro.helpers;

export default class SetupProfileScreen extends Component {
  state = {
    avatarImageUri: null,
    name: null,
    username: null,
    loading: false,
  }

  usernameField = null;

  _selectAvatarImage = () => {
    attachmentsHelper.selectMedia({
      sources: [ 'camera', 'library' ],
      onMediaSelected: result => { console.log(result); this.setState({ avatarImageUri: result.path }); },
      imagePickerOptions: {
        width: 512,
        height: 512,
        mediaType: 'photo',
        cropperToolbarTitle: 'Pinch To Zoom Or Drag To Crop',
        cropperCircleOverlay: true,
        cropping: true,
        useFrontCamera: true,
        forceJpg: true,
      },
    });
  }

  _submit = async () => {
    const { avatarImageUri, name, username } = this.state;

    this.setState({ loading: true });

    try {
      await userManager.updateUser({
        avatarUri: avatarImageUri,
        name,
        username,
      });
    } catch (error) {
      interfaceHelper.showError({ message: error.message });

      return this.setState({ loading: false });
    }

    navigationHelper.resetRoot(userManager.nextRouteNameForUserState());
  }

  render() {
    const { avatarImageUri, name, username, loading } = this.state;
    const ContainerComponent = interfaceHelper.deviceValue({
      default: KeyboardAwareScrollView,
      lg: KeyboardAvoidingView,
    });

    return (
      <ContainerComponent
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.contentContainer}
        behavior={'padding'}
        keyboardVerticalOffset={-85}
        style={styles.contentContainer}
      >
        <View style={styles.previewContainer}>
          <BabbleUserAvatar
            avatarAttachment={(avatarImageUri) ? { url: avatarImageUri } : null}
            defaultAvatar={require('../assets/images/upload-photo-placeholder.png')}
            onPress={this._selectAvatarImage}
            hideStatusIcon
            showEditIcon={!!avatarImageUri}
            size={interfaceHelper.deviceValue({ default: 150, lg: 200 })}
            style={styles.avatar}
          />

          {!!name && (
            <Text style={[ styles.previewText, styles.previewNameText ]}>{name}</Text>
          )}

          {!!username && (
            <Text style={[ styles.previewText, styles.previewUsernameText ]}>@{username}</Text>
          )}

          <BabbleBackground
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
            label={`What's your name?`}
            returnKeyType={'next'}
            blurOnSubmit={false}
            autoCapitalize={'words'}
            autoCompleteType={'name'}
            autoCorrect={false}
            onChangeText={text => this.setState({ name: text })}
            onSubmitEditing={() => this.usernameField.focus()}
            containerStyle={styles.fieldContainer}
            value={name}
          />

          <BabbleUsernameField
            label={'Pick a username'}
            returnKeyType={'done'}
            autoCompleteType={'username'}
            onChangeText={text => this.setState({ username: text })}
            info={'You can always change this later.'}
            containerStyle={styles.lastFieldContainer}
            value={username}
            ref={component => this.usernameField = component}
          />

          <BabbleButton
            onPress={this._submit}
            loading={loading}
            disabled={!name || !username}
          >
            Continue
          </BabbleButton>
        </View>
      </ContainerComponent>
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
  contentContainer: {
    flexDirection: interfaceHelper.deviceValue({ default: 'column', lg: 'row' }),
    minHeight: '100%',
  },
  fieldContainer: {
    marginBottom: 25,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: interfaceHelper.deviceValue({ default: 30, lg: 60 }),
    paddingVertical: interfaceHelper.platformValue({ default: 0, android: 30 }),
  },
  lastFieldContainer: {
    marginBottom: 50,
  },
  previewContainer: {
    alignItems: 'center',
    flex: interfaceHelper.deviceValue({ default: 0.9, lg: 1.618 }),
    justifyContent: 'center',
    paddingVertical: interfaceHelper.platformValue({ default: 0, android: 30 }),
  },
  previewNameText: {
    fontSize: interfaceHelper.deviceValue({ default: 22, lg: 36 }),
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
    fontSize: interfaceHelper.deviceValue({ default: 18, lg: 30 }),
  },
});
