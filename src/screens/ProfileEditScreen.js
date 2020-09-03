import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BabbleUserAvatar, BabbleSettingField } from '../components';
import { ChevronRightIcon } from '../components/icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { attachmentsHelper, interfaceHelper, navigationHelper } = maestro.helpers;

export default class ProfileEditScreen extends Component {
  state = {
    avatarImageUri: null,
    name: userManager.store.user.name,
    username: userManager.store.user.username,
    about: userManager.store.user.about,
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      onRightButtonPress: this._savePress,
    });
  }

  _selectAvatarImage = () => {
    attachmentsHelper.selectMedia({
      sources: [ 'camera', 'library' ],
      onMediaSelected: result => this.setState({ avatarImageUri: result.path }),
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

  _savePress = async () => {
    const { navigation } = this.props;
    const { avatarImageUri, name, username, about } = this.state;

    navigation.setOptions({ showRightLoading: true });

    try {
      await userManager.updateUser({
        avatarUri: avatarImageUri,
        name,
        username,
        about,
      });
    } catch (error) {
      interfaceHelper.showError({ message: error.message });

      return navigation.setOptions({ showRightLoading: false });
    }

    navigationHelper.pop();
  }

  render() {
    const { user } = userManager.store;
    const { avatarImageUri, name, username, about } = this.state;

    return (
      <KeyboardAwareScrollView
        extraHeight={150}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.contentContainer}
      >
        <BabbleUserAvatar
          avatarAttachment={(avatarImageUri) ? { url: avatarImageUri } : user.avatarAttachment}
          defaultAvatar={require('../assets/images/upload-photo-placeholder.png')}
          onPress={this._selectAvatarImage}
          hideStatusIcon
          showEditIcon={!!user.avatarAttachment || !!avatarImageUri}
          size={120}
        />

        <Text style={styles.nameText}>{user.name}</Text>
        <Text style={styles.usernameText}>@{user.username}</Text>

        <View style={styles.settingsContainer}>
          <BabbleSettingField
            label={'Name'}
            editable
            returnKeyType={'done'}
            onChangeText={text => this.setState({ name: text })}
            value={name}
          />

          <View style={styles.border} />

          <BabbleSettingField
            label={'Username'}
            editable
            returnKeyType={'done'}
            autoCorrect={false}
            onChangeText={text => this.setState({ username: text })}
            valuePrefix={'@'}
            value={username}
          />

          <View style={styles.border} />

          <BabbleSettingField
            label={'Bio'}
            editable
            multiline
            maxLength={150}
            placeholder={'(Tell the world a little about yourself)'}
            onChangeText={text => this.setState({ about: text })}
            value={about}
          />

          <View style={styles.border} />

          <BabbleSettingField
            label={'Account Phone Number'}
            value={user.phone}
          />

          <View style={styles.border} />

          <BabbleSettingField
            label={'Privacy Policy'}
            IconComponent={ChevronRightIcon}
          />

          <View style={styles.border} />

          <BabbleSettingField
            label={'Terms & Conditions'}
            IconComponent={ChevronRightIcon}
          />

          <View style={styles.border} />

          <BabbleSettingField
            onPress={() => userManager.logout()}
            label={'Logout'}
            labelStyle={styles.logoutLabelText}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    backgroundColor: '#D8D8D8',
    height: 0.5,
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoutLabelText: {
    color: '#F54444',
  },
  nameText: {
    color: '#494949',
    fontFamily: 'NunitoSans-ExtraBold',
    fontSize: 20,
    marginTop: 20,
  },
  settingsContainer: {
    marginTop: 40,
    paddingHorizontal: 15,
    width: '100%',
  },
  usernameText: {
    color: '#BEBEBE',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 18,
  },
});
