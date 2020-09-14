import React, { Component } from 'react';
import { View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BabbleUserPreview, BabbleSettingField, BabbleViewMoreButton } from '../components';
import { ChevronRightIcon } from '../components/icons';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { roomsManager } = maestro.managers;
const { navigationHelper, interfaceHelper } = maestro.helpers;

export default class RoomInfoScreen extends Component {
  static contextType = NavigationTypeContext;

  state = {
    title: this.props.route.params.room.title,
    roomUsers: null,
  }

  async componentDidMount() {
    const { room } = this.props.route.params;
    const { authRoomUser } = room;
    const roomUsers = await roomsManager.getRoomUsers(room.id);

    if (authRoomUser && authRoomUser.permissions.includes('ROOM_ADMIN')) {
      this.props.navigation.setOptions({
        rightButtonTitle: 'Save',
        onRightButtonPress: this._savePress,
      });
    }

    this.setState({ roomUsers });
  }

  _deletePress = () => {
    Alert.alert('Delete this room?', 'Are you sure you want to permanently delete this room? This cannot be undone.', [
      {
        text: 'Delete',
        onPress: async () => {
          const { room } = this.props.route.params;

          this.props.navigation.setOptions({ showRightLoading: true });
          await roomsManager.deleteRoom(room.id);
          navigationHelper.pop(2);
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }

  _leavePress = () => {
    Alert.alert('Leave this room?', 'Are you sure you want to leave this room?', [
      {
        text: 'Leave',
        onPress: async () => {
          const { room } = this.props.route.params;

          this.props.navigation.setOptions({ showRightLoading: true });
          await roomsManager.leaveRoom(room.id);
          navigationHelper.pop(2);
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }

  _reportPress = () => {
    Alert.alert('Report this room?', 'You should only report this room if it focuses on hate speech, racism, harming others or criminal activity.', [
      {
        text: 'Report',
        onPress: () => {
          Alert.alert('Reported Successfully', 'Thank you. This room has been reported.');
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }

  _savePress = async () => {
    const { navigation } = this.props;
    const { room } = this.props.route.params;
    const { title } = this.state;

    navigation.setOptions({ showRightLoading: true });

    try {
      await roomsManager.updateRoom({
        roomId: room.id,
        fields: { title },
      });
    } catch (error) {
      interfaceHelper.showError({ message: error.message });

      return navigation.setOptions({ showRightLoading: false });
    }

    navigationHelper.pop(1, this.context);
  }

  _openRoomUsers = () => {
    const { room } = this.props.route.params;

    navigationHelper.push('RoomUsers', {
      roomId: room.id,
    }, this.context);
  }

  _getAccessLevelText = () => {
    const { accessLevel } = this.props.route.params.room;

    if (accessLevel === 'public') {
      return 'Public - Anyone can join this room, send and react to messages, and invite others.';
    }

    if (accessLevel === 'protected') {
      return 'Audience - Only select people can send messages. Anyone can join this room to read and react to messages.';
    }

    if (accessLevel === 'private') {
      return 'Private - Only participants can see this room, send messages and react to messages.';
    }
  }

  render() {
    const { room } = this.props.route.params;
    const { authRoomUser } = room;
    const { title, roomUsers } = this.state;

    return (
      <KeyboardAwareScrollView
        extraHeight={150}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.contentContainer}
      >
        <BabbleSettingField
          label={'Name'}
          editable={!!authRoomUser && authRoomUser.permissions.includes('ROOM_ADMIN')}
          returnKeyType={'done'}
          placeholder={'(Optional)'}
          maxLength={150}
          onChangeText={text => this.setState({ title: text })}
          value={title}
        />

        <View style={styles.border} />

        <BabbleSettingField
          label={'Type'}
          returnKeyType={'done'}
          value={this._getAccessLevelText()}
        />

        <View style={styles.border} />

        <BabbleSettingField label={'Owner'}>
          <BabbleUserPreview
            user={room.user}
            style={styles.participant}
          />
        </BabbleSettingField>

        <View style={styles.border} />

        <BabbleSettingField
          label={`Participants (${room.usersCount})`}
          onPress={(room.usersCount > 5) ? this._openRoomUsers : null}
          IconComponent={(room.usersCount > 5) ? ChevronRightIcon : null}
          style={styles.participantsSettingField}
        >
          {!roomUsers && (
            <ActivityIndicator size={'large'} style={styles.loadingIndicator} />
          )}

          {!!roomUsers && roomUsers.map(roomUser => (
            <BabbleUserPreview
              user={roomUser.user}
              style={styles.participant}
              key={roomUser.id}
            />
          ))}

          {!!roomUsers && room.usersCount > 5 && (
            <BabbleViewMoreButton
              onPress={this._openRoomUsers}
              style={styles.viewMoreButton}
            />
          )}
        </BabbleSettingField>

        {!!authRoomUser && !authRoomUser.permissions.includes('ROOM_ADMIN') && (
          <>
            <BabbleSettingField
              onPress={this._leavePress}
              label={'Leave Room'}
              labelStyle={styles.red}
            />

            <View style={styles.border} />
          </>
        )}

        {(!authRoomUser || !authRoomUser.permissions.includes('ROOM_ADMIN')) && (
          <BabbleSettingField
            onPress={this._reportPress}
            label={'Report Room'}
            labelStyle={styles.red}
          />
        )}

        {!!authRoomUser && authRoomUser.permissions.includes('ROOM_ADMIN') && (
          <BabbleSettingField
            onPress={this._deletePress}
            label={'Delete Room'}
            labelStyle={styles.red}
          />
        )}
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
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  loadingIndicator: {
    marginTop: 15,
  },
  participant: {
    marginTop: 20,
  },
  participantsSettingField: {
    alignItems: 'flex-start',
  },
  red: {
    color: '#F54444',
  },
  viewMoreButton: {
    marginBottom: 0,
    marginTop: 15,
  },
});
