import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, LayoutAnimation, StyleSheet } from 'react-native';
import { BabbleRoomUserList, BabbleUserAvatar, BabbleConnectDeviceContactsView } from './';
import { UsersIcon, MessageCircleIcon, LockIcon, ChevronDownIcon } from './icons';
import maestro from '../maestro';

const { deviceContactsManager, userManager } = maestro.managers;
const { interfaceHelper } = maestro.helpers;

export default class BabbleRoomComposerToolbar extends Component {
  state = {
    accessLevel: null,
    search: '',
    title: null,
    selectedUserIndex: null,
    selectedUsers: [],
    searchUsers: [],
    contactUsers: [],
    showSearchUsersList: false,
    loadingSearch: false,
  }

  searchTextInput = null;
  searchTextInputTimeout = null;
  titleTextInput = null;
  lastKeyPress = null;

  componentDidMount() {
    maestro.link(this);

    const { initialAccessLevel } = this.props;

    if (deviceContactsManager.requestedPermission()) {
      deviceContactsManager.loadContacts();
    }

    if (initialAccessLevel) {
      this.setState({ accessLevel: initialAccessLevel });

      setTimeout(() => {
        if (initialAccessLevel === 'public') {
          this.titleTextInput.focus();
        } else {
          this.searchTextInput.focus();
        }
      }, 250);
    }
  }

  componentWillUnmount() {
    maestro.unlink(this);

    clearTimeout(this.searchTextInputTimeout);
  }

  receiveStoreUpdate({ deviceContacts }) {
    const { contacts } = deviceContacts;

    if (contacts) {
      this.setState({
        contactUsers: contacts,
        searchUsers: contacts,
      });
    }
  }

  receiveEvent(name, value) {
    if (name === 'APP_STATE_CHANGED' && value === 'active' && deviceContactsManager.requestedPermission() && !deviceContactsManager.grantedPermission()) {
      deviceContactsManager.loadContacts();
    }
  }

  get accessLevel() {
    return this.state.accessLevel || 'public';
  }

  get title() {
    return this.state.title;
  }

  get selectedUsers() {
    return this.state.selectedUsers;
  }

  addUser = user => {
    const { onUserSelectionAccessLevelChange } = this.props;
    const accessLevel = this.state.accessLevel || 'private';
    const selectedUsers = [ ...this.state.selectedUsers, user ];

    if (onUserSelectionAccessLevelChange) {
      onUserSelectionAccessLevelChange({ accessLevel, selectedUsers });
    }

    this.setState({
      accessLevel,
      search: '',
      searchUsers: [],
      selectedUsers,
    }, () => this._toggleSearchUsersList(false));
  }

  removeUser = ({ userId, selectedUserIndex }) => {
    const { onUserSelectionAccessLevelChange } = this.props;
    const accessLevel = this.accessLevel;
    const selectedUsers = this.state.selectedUsers.filter((user, index) => {
      return (
        (!userId || user.id !== userId) &&
        (isNaN(selectedUserIndex) || index !== selectedUserIndex)
      );
    });

    if (onUserSelectionAccessLevelChange) {
      onUserSelectionAccessLevelChange({ accessLevel, selectedUsers });
    }

    this.setState({
      accessLevel,
      selectedUsers,
    });
  }

  _onKeyPress = ({ nativeEvent }) => {
    const { key } = nativeEvent;
    const { search } = this.state;

    this.lastKeyPress = key;

    if (key === 'Backspace' && !search.length) {
      this._onChangeText(search);
    }
  }

  _onChangeText = text => {
    const { selectedUserIndex, search, selectedUsers } = this.state;
    const state = {
      search: text,
      selectedUserIndex: null,
      searchUsers: [],
    };

    if (this.lastKeyPress === 'Backspace' && (!search.length || selectedUserIndex !== null)) {
      if (selectedUserIndex !== null) {
        this.removeUser({ selectedUserIndex });
        state.search = '';
      } else if (selectedUsers.length > 0) {
        state.selectedUserIndex = selectedUsers.length - 1;
      }
    }

    this.setState(state, () => this._search(text));
  }

  _onFocus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this._toggleSearchUsersList(true);
  }

  _onBlur = () => {
    this._toggleSearchUsersList(false);
  }

  _getSearchUsers = async search => {
    const { selectedUsers } = this.state;
    const selectedUserIds = selectedUsers.map(selectedUser => selectedUser.id);

    return (await userManager.searchUsers(search)).filter(searchUser => (
      !selectedUserIds.includes(searchUser.id)
    ));
  }

  _getContactUsers = search => {
    const { selectedUsers, contactUsers } = this.state;
    const selectedUserIds = selectedUsers.map(selectedUser => selectedUser.id);

    if (!contactUsers?.length) {
      return [];
    }

    return contactUsers.filter(contactUser => (
      !selectedUserIds.includes(contactUser.id) && (!search || contactUser.name.includes(search))
    ));
  }

  _getToPlaceholder = () => {
    const { accessLevel, selectedUsers, showSearchUsersList } = this.state;

    if (([ 'protected', 'private' ].includes(accessLevel) || showSearchUsersList) && !selectedUsers.length) {
      return 'Type to search users...';
    }

    return '';
  }

  _search = search => {
    clearTimeout(this.searchTextInputTimeout);

    if (!search) {
      this._toggleSearchUsersList(false);
      return this.setState({ loadingSearch: false });
    }

    this._toggleSearchUsersList(true);
    this.setState({ loadingSearch: true });

    this.searchTextInputTimeout = setTimeout(async () => {
      const searchAppUsers = await this._getSearchUsers(search);
      const searchContactUsers = this._getContactUsers(search);
      const searchUsers = [ ...searchAppUsers, ...searchContactUsers ].filter(user => (
        !!user.phone || !!user.username
      )).sort((a, b) => (
        (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0
      ));

      this.setState({ searchUsers, loadingSearch: false });
    }, 350);
  }

  _toggleSearchUsersList = show => {
    const { selectedUsers, search } = this.state;
    const state = { showSearchUsersList: show };

    if (show && !search && selectedUsers.length) {
      state.showSearchUsersList = false;
    }

    if (!show && !search && !selectedUsers.length && this.searchTextInput.isFocused()) {
      state.showSearchUsersList = true;
      state.searchUsers = this._getContactUsers();
    }

    this.setState(state);
  }

  _accessLevelPress = () => {
    const { accessLevel } = this.state;

    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: {
        actions: [
          {
            iconComponent: MessageCircleIcon,
            text: 'Public',
            subtext: 'Anyone can view and join this room, send and react to messages, and invite others.',
            highlighted: !accessLevel || accessLevel === 'public',
            onPress: () => this._changeAccessLevel('public'),
          },
          {
            iconComponent: UsersIcon,
            text: 'Audience',
            subtext: 'Only people you invite to this room can send messages. Anyone can join this room to view and react to messages.',
            highlighted: accessLevel === 'protected',
            onPress: () => this._changeAccessLevel('protected'),
          },
          {
            iconComponent: LockIcon,
            text: 'Private',
            subtext: 'Only people you choose can see this room, send messages and react to messages.',
            highlighted: accessLevel === 'private',
            onPress: () => this._changeAccessLevel('private'),
          },
        ],
      },
    });
  }

  _changeAccessLevel = accessLevel => {
    const { onUserSelectionAccessLevelChange } = this.props;
    const { selectedUsers } = this.state;

    if (accessLevel === this.state.accessLevel) {
      return;
    }

    this.setState({ accessLevel });

    onUserSelectionAccessLevelChange({ selectedUsers, accessLevel });
  }

  _userPress = userIndex => {
    this.searchTextInput.focus();
    this.setState({ selectedUserIndex: userIndex });
  }

  _toolbarPress = () => {
    this.searchTextInput.focus();
    this.setState({ selectedUserIndex: null });
  }

  render() {
    const { editable, style } = this.props;
    const { accessLevel, title, selectedUserIndex, search, selectedUsers, searchUsers, showSearchUsersList, loadingSearch } = this.state;
    const canAccessContacts = deviceContactsManager.grantedPermission();

    return (
      <View
        style={[
          styles.container,
          (showSearchUsersList) ? styles.focused : null,
          style,
        ]}
      >
        <TouchableOpacity disabled={!editable} onPress={this._accessLevelPress} style={styles.accessLevelButton}>
          {(!accessLevel || accessLevel === 'public') && (
            <>
              <MessageCircleIcon width={16} height={16} style={styles.accessLevelButtonIcon} />
              <Text style={styles.accessLevelButtonText}>Public</Text>
            </>
          )}

          {accessLevel === 'protected' && (
            <>
              <UsersIcon width={16} height={16} style={styles.accessLevelButtonIcon} />
              <Text style={styles.accessLevelButtonText}>Audience</Text>
            </>
          )}

          {accessLevel === 'private' && (
            <>
              <LockIcon width={16} height={16} style={styles.accessLevelButtonIcon} />
              <Text style={styles.accessLevelButtonText}>Private</Text>
            </>
          )}

          <ChevronDownIcon width={20} height={20} style={styles.accessLevelButtonIcon} />
        </TouchableOpacity>

        {(accessLevel && accessLevel !== 'public') && (
          <TouchableWithoutFeedback onPress={this._toolbarPress}>
            <View style={styles.toolbarContainer}>
              <Text style={styles.labelText}>Invite:</Text>

              {selectedUsers.map((selectedUser, index) => (
                <TouchableOpacity
                  onPress={() => this._userPress(index)}
                  disabled={!editable}
                  key={index}
                  style={[
                    styles.user,
                    (index === selectedUserIndex) ? styles.userSelected : null,
                  ]}
                >
                  <BabbleUserAvatar
                    avatarAttachment={selectedUser.avatarAttachment}
                    lastActiveAt={selectedUser.lastActiveAt}
                    disabled
                    size={20}
                    style={styles.avatar}
                    statusIconStyle={styles.avatarActivityIcon}
                  />

                  <Text
                    style={[
                      styles.nameText,
                      (index === selectedUserIndex) ? styles.nameSelectedText : null,
                    ]}
                  >
                    {selectedUser.name}
                  </Text>
                </TouchableOpacity>
              ))}

              <TextInput
                caretHidden={selectedUserIndex !== null}
                onKeyPress={this._onKeyPress}
                onChangeText={this._onChangeText}
                onFocus={this._onFocus}
                onBlur={this._onBlur}
                editable={editable !== undefined ? editable : true}
                placeholder={this._getToPlaceholder()}
                placeholderTextColor={'#D8D8D8'}
                returnKeyType={'done'}
                value={search}
                style={styles.textInput}
                ref={component => this.searchTextInput = component}
              />
            </View>
          </TouchableWithoutFeedback>
        )}

        {accessLevel !== 'private' && !showSearchUsersList && (
          <TouchableWithoutFeedback onPress={() => this.titleTextInput.focus()}>
            <View style={styles.toolbarContainer}>
              <Text style={styles.labelText}>Room Name:</Text>

              <TextInput
                onChangeText={text => this.setState({ title: text })}
                placeholder={''}
                placeholderTextColor={'#D8D8D8'}
                returnKeyType={'done'}
                editable={editable !== undefined ? editable : true}
                value={title}
                style={styles.textInput}
                ref={component => this.titleTextInput = component}
              />
            </View>
          </TouchableWithoutFeedback>
        )}

        {showSearchUsersList && (
          <View style={styles.usersListContainer}>
            {(!!search || (selectedUsers.length === 0 && canAccessContacts)) && (
              <BabbleRoomUserList
                loading={loadingSearch}
                users={searchUsers}
                disableNoResultsMessage={!search}
                noResultsMessage={'No users found'}
                onPress={this.addUser}
                contentContainerStyle={styles.usersList}
                ListHeaderComponent={(!search && !selectedUsers.length) ? <Text style={styles.suggestedText}>My Contacts</Text> : null}
              />
            )}

            {!canAccessContacts && !selectedUsers.length && !search && (
              <BabbleConnectDeviceContactsView
                promptText={'Invite friends in your contacts to your room or type to search Babble users.'}
                contentContainerStyle={styles.connectDeviceContactsContainer}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accessLevelButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#2A99CC',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 4,
    position: 'absolute',
    right: 15,
    top: interfaceHelper.deviceValue({ default: 17, lg: 16 }),
    zIndex: 1,
  },
  accessLevelButtonIcon: {
    color: '#2A99CC',
  },
  accessLevelButtonText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 16 }),
    marginLeft: 5,
    marginRight: 2.5,
  },
  avatar: {
    marginRight: 5,
  },
  avatarActivityIcon: {
    borderWidth: 1,
    height: 8,
    right: -2,
    top: -2,
    width: 8,
  },
  connectDeviceContactsContainer: {
    marginTop: 130,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flexShrink: 1,
  },
  focused: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  labelText: {
    color: '#909090',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 16, lg: 17 }),
    marginRight: 10,
  },
  nameSelectedText: {
    color: '#FFFFFF',
  },
  nameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 16 }),
  },
  suggestedText: {
    color: '#404040',
    fontFamily: 'NunitoSans-Bold',
    fontSize: interfaceHelper.deviceValue({ default: 15, lg: 16 }),
    paddingBottom: 5,
    paddingHorizontal: 15,
  },
  textInput: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: interfaceHelper.deviceValue({ default: 16, lg: 17 }),
    marginLeft: 5,
    paddingVertical: 5,
  },
  toolbarContainer: {
    alignItems: 'center',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    width: '100%',
  },
  user: {
    alignItems: 'center',
    backgroundColor: '#F1F2F6',
    borderRadius: 4,
    flexDirection: 'row',
    marginBottom: 5,
    marginRight: 5,
    padding: 5,
  },
  userSelected: {
    backgroundColor: '#2A99CC',
  },
  usersList: {
    paddingBottom: 30,
  },
  usersListContainer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
});
