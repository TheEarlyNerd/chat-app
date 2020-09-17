import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ActivityIndicator, Alert, Dimensions, StyleSheet, Platform } from 'react-native';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { BabbleRoomComposerToolbar, BabbleRoomHeaderTitle, BabbleRoom, BabbleRoomMessageComposerToolbar, BabbleRoomViewerToolbar } from '../components';
import { AlertTriangleIcon, RepeatIcon, InfoIcon, MoreVerticalIcon, UserPlusIcon } from '../components/icons';
import NavigationTypeContext from '../navigators/contexts/NavigationTypeContext';
import maestro from '../maestro';

const { roomsManager } = maestro.managers;
const { navigationHelper, interfaceHelper } = maestro.helpers;

const windowHeight = Dimensions.get('window').height;

export default class RoomScreen extends Component {
  static contextType = NavigationTypeContext;

  room = null;
  roomComposer = null;
  messageComposer = null;
  typingTimeout = null;

  state = {
    room: null,
    composingRoom: !this.props.route?.params?.roomId,
    loading: false,
    keyboardVerticalOffset: 0,
  }

  componentDidMount() {
    maestro.link(this);

    this.props.navigation.addListener('focus', this._screenFocused);
    this.props.navigation.addListener('blur', this._screenBlurred);

    const params = this.props.route.params || {};
    const { roomId, title, composeToUsers } = params;

    if (!title) {
      this.props.navigation.setOptions({
        title: (roomId) ? <ActivityIndicator color={'#FFFFFF'} /> : 'New Room',
      });
    }

    if (roomId) {
      roomsManager.loadActiveRoom(roomId); // handle non existent convos?

      this.props.navigation.addListener('blur', () => {
        roomsManager.markRoomRead(roomId);
      });

      this.props.navigation.setOptions({
        rightButtonComponent: <MoreVerticalIcon width={31} height={31} style={styles.moreIcon} />,
        onRightButtonPress: this._showMoreActionSheet,
      });
    }

    if (Array.isArray(composeToUsers)) {
      composeToUsers.forEach(user => this.roomComposer.addUser(user));
    }
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  receiveStoreUpdate({ rooms }) {
    const { activeRooms } = rooms;
    const roomId = this.state.room?.id || this.props.route?.params?.roomId;

    if (!Array.isArray(activeRooms) || !roomId) {
      return;
    }

    const room = activeRooms.find(room => room.id === roomId);

    this._setRoom(room);
  }

  receiveEvent(name, value) {
    const { room } = this.state;

    if (room && name === 'APP_STATE_CHANGED' && value === 'active') {
      this._loadNewMessages();
    }
  }

  _screenFocused = () => {
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }
  }

  _screenBlurred = () => {
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
  }

  _onLayout = ({ nativeEvent }) => {
    this.setState({
      keyboardVerticalOffset: windowHeight - nativeEvent.layout.height,
    });
  }

  _loadNewMessages = () => {
    const { room, composingRoom } = this.state;
    const { roomMessages } = room;

    if (!room.id || composingRoom) {
      return [];
    }

    return roomsManager.loadActiveRoomMessages({
      roomId: room.id,
      queryParams: { after: roomMessages[0].createdAt },
    });
  }

  _loadOldMessages = () => {
    const { room, composingRoom } = this.state;
    const { roomMessages } = room;

    if (!room.id || composingRoom) {
      return []; // FIX: prevent autoload bug on new convo, could do something cleaner?
    }

    return roomsManager.loadActiveRoomMessages({
      roomId: room.id,
      queryParams: { before: roomMessages[roomMessages.length - 1].createdAt },
    });
  }

  _showMoreActionSheet = () => {
    const { room } = this.state;
    const { id, accessLevel, authRoomUser, authUserRoomRepost, usersCount } = room;
    const hasInvitePermission = (authRoomUser) ? (
      authRoomUser.permissions.includes('ROOM_ADMIN') ||
      authRoomUser.permissions.includes('ROOM_USERS_CREATE')
    ) : false;

    const actions = [];

    if ((room.accessLevel === 'public' || hasInvitePermission) && (accessLevel !== 'private' || usersCount > 2)) {
      actions.push({
        iconComponent: UserPlusIcon,
        text: 'Invite Others',
        subtext: 'Send invitations to other users or people in your contact list to join this room.',
        onPress: () => {
          interfaceHelper.showOverlay({
            name: 'UsersSelector',
            data: {
              roomId: room.id,
            },
          });
        },
      });
    }

    if (room.accessLevel !== 'private') {
      actions.push({
        iconComponent: RepeatIcon,
        text: (!authUserRoomRepost) ? 'Repost' : 'Delete Repost',
        subtext: (!authUserRoomRepost) ? 'This room will be reposted to your profile.' : 'Your repost of this room will be deleted and removed your profile.',
        onPress: () => {
          if (!authUserRoomRepost) {
            roomsManager.createRoomRepost(id);
            Alert.alert('Reposted', 'This room has been reposted to your profile.');
          } else {
            roomsManager.deleteRoomRepost(id);
            Alert.alert('Repost Deleted', 'This room repost has been deleted and removed from your profile.');
          }
        },
      });
    }

    actions.push({
      iconComponent: InfoIcon,
      text: 'View Info',
      subtext: 'See additional details about this room and its participants.',
      onPress: () => {
        navigationHelper.push('RoomInfo', { room }, this.context);
      },
    });

    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: { actions },
    });
  }

  _setRoom = room => {
    if (room) {
      this.props.navigation.setOptions({
        title: <BabbleRoomHeaderTitle room={room} />,
        rightButtonComponent: <MoreVerticalIcon width={31} height={31} style={styles.moreIcon} />,
        onRightButtonPress: this._showMoreActionSheet,
      });
    }

    this.setState({ room });
  }

  _onTyping = () => {
    const { room } = this.state;

    if (room && this.typingTimeout === null) {
      this.typingTimeout = setTimeout(() => this.typingTimeout = null, 2500);
      roomsManager.createTypingEvent({ roomId: room.id });
    }
  }

  _onMessageSubmit = async ({ text, attachments, embeds }) => {
    const { room, composingRoom } = this.state;
    const { accessLevel, title, selectedUsers } = this.roomComposer || {};

    if (room) {
      this.room.scrollToEnd();
      this.messageComposer.clear();

      if (composingRoom) { // edge case for composing but sending to private & existing convo for users, see _onUserSelectionAccessLevelChange
        this.setState({ loading: true });
        this._setRoom(await roomsManager.loadActiveRoom(room.id));
        this.setState({ loading: false, composingRoom: false });
      }

      return await roomsManager.createRoomMessage({
        roomId: room.id,
        text,
        attachments,
        embeds,
      });
    }

    if (!title && accessLevel !== 'private') {
      return interfaceHelper.showError({
        message: 'Please provide a room name.',
        iconComponent: AlertTriangleIcon,
      });
    }

    let createdRoom = null;

    this.setState({ loading: true });

    try {
      const userIds = selectedUsers.map(selectedUser => (!selectedUser.isPhoneContact) ? selectedUser.id : null).filter(userId => !!userId);
      const phoneUsers = selectedUsers.map(selectedUser => (selectedUser.isPhoneContact) ? ({
        phone: selectedUser.phone,
        name: selectedUser.name,
      }) : null).filter(phoneUser => !!phoneUser);

      createdRoom = await roomsManager.createRoom({
        accessLevel,
        title: (accessLevel !== 'private') ? title : null,
        userIds,
        phoneUsers,
        message: { text, attachments, embeds },
      });
    } catch (error) {
      this.setState({ loading: false });

      return interfaceHelper.showError({ message: error.message });
    }

    this.messageComposer.clear();
    this._setRoom(createdRoom);
    this.setState({
      composingRoom: false,
      loading: false,
    });
  }

  _onUserSelectionAccessLevelChange = async ({ selectedUsers, accessLevel }) => {
    this._setRoom(null);

    if (accessLevel === 'private' && selectedUsers.length) {
      const userIds = selectedUsers.map(user => (!user.isPhoneContact) ? user.id : null).filter(userId => !!userId);
      const phones = selectedUsers.map(user => (user.isPhoneContact) ? user.phone : null).filter(phone => !!phone);
      const room = await roomsManager.getPrivateRoom({ userIds, phones });

      this.props.navigation.setOptions({ title: (room) ? 'New Message' : 'New Room' });

      this.setState({ room });
    } else {
      this.props.navigation.setOptions({ title: 'New Room' });
    }
  }

  render() {
    const { room, composingRoom, loading, keyboardVerticalOffset } = this.state;
    const { accessLevel, roomMessages, roomTypingUsers, authRoomUser } = room || {};
    const { composeAccessLevel } = this.props.route.params || {};
    const showViewerToolbar = accessLevel === 'protected' && (
      !authRoomUser || (
        !authRoomUser.permissions.includes('ROOM_ADMIN') &&
        !authRoomUser.permissions.includes('ROOM_MESSAGES_CREATE')
      )
    );

    return (
      <SafeAreaView style={styles.container} onLayout={this._onLayout}>
        <KeyboardAvoidingView
          behavior={interfaceHelper.platformValue({ default: 'padding', android: undefined })}
          keyboardVerticalOffset={interfaceHelper.platformValue({ default: keyboardVerticalOffset, android: 0 })}
          style={styles.container}
        >
          {composingRoom && (
            <BabbleRoomComposerToolbar
              editable={!loading}
              initialAccessLevel={composeAccessLevel}
              onUserSelectionAccessLevelChange={this._onUserSelectionAccessLevelChange}
              ref={component => this.roomComposer = component}
            />
          )}

          <BabbleRoom
            loadOldMessages={this._loadOldMessages}
            messages={roomMessages}
            typingUsers={roomTypingUsers}
            ref={component => this.room = component}
          />

          {!!room && showViewerToolbar && (
            <BabbleRoomViewerToolbar room={room} />
          )}

          {(!room || !showViewerToolbar) && (
            <BabbleRoomMessageComposerToolbar
              onTyping={this._onTyping}
              onSubmit={this._onMessageSubmit}
              loading={loading}
              ref={component => this.messageComposer = component}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  moreIcon: {
    color: '#FFFFFF',
  },
});
