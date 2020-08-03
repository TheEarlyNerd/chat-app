import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { BabbleConversationUserList, BabbleUserAvatar } from './';
import { UsersIcon, MessageCircleIcon, LockIcon, ChevronDownIcon } from './icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { interfaceHelper } = maestro.helpers;

export default class BabbleConversationComposerToolbar extends Component {
  state = {
    accessLevel: null,
    search: null,
    title: null,
    selectedUserIndex: null,
    selectedUsers: [],
    searchUsers: [],
    showSearchUsersList: false,
    loadingSearch: false,
  }

  searchTextInput = null;
  searchTextInputTimeout = null;
  titleTextInput = null;
  lastKeyPress = null;

  componentWillUnmount() {
    clearTimeout(this.searchTextInputTimeout);
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
    const { onUserSelectionChange } = this.props;
    const accessLevel = this.state.accessLevel || 'private';
    const selectedUsers = [ ...this.state.selectedUsers, user ];

    if (onUserSelectionChange) {
      onUserSelectionChange({ accessLevel, selectedUsers });
    }

    this.setState({
      accessLevel,
      search: '',
      selectedUsers,
      searchUsers: [],
    });
  }

  removeUser = ({ userId, selectedUserIndex }) => {
    const { onUserSelectionChange } = this.props;
    const accessLevel = this.accessLevel;
    const selectedUsers = this.state.selectedUsers.filter((user, index) => {
      return (
        (!userId || user.id !== userId) &&
        (isNaN(selectedUserIndex) || index !== selectedUserIndex)
      );
    });

    if (onUserSelectionChange) {
      onUserSelectionChange({ accessLevel, selectedUsers });
    }

    this.setState({ accessLevel, selectedUsers });
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

    this._search(text);

    this.setState(state);
  }

  _search = search => {
    clearTimeout(this.searchTextInputTimeout);

    if (!search) {
      return this.setState({ loadingSearch: false });
    }

    this.setState({ loadingSearch: true });

    this.searchTextInputTimeout = setTimeout(async () => {
      const { selectedUsers } = this.state;
      const selectedUserIds = selectedUsers.map(selectedUser => selectedUser.id);
      const searchUsers = (await userManager.searchUsers(search)).filter(searchUser => {
        return !selectedUserIds.includes(searchUser.id);
      });

      this.setState({ searchUsers, loadingSearch: false });
    }, 500);
  }

  _accessLevelPress = () => {
    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: {
        actions: [
          {
            iconComponent: MessageCircleIcon,
            text: 'Public',
            subtext: 'Anyone can join this conversation, send and react to messages, and invite others.',
            onPress: () => this.setState({ accessLevel: 'public' }),
          },
          {
            iconComponent: UsersIcon,
            text: 'V.I.P.',
            subtext: 'Only people you invite to this conversation can send messages. Anyone can see this conversation and react to messages.',
            onPress: () => this.setState({ accessLevel: 'protected' }),
          },
          {
            iconComponent: LockIcon,
            text: 'Private',
            subtext: 'Only people you choose can see this conversation, send messages and react to messages.',
            onPress: () => this.setState({ accessLevel: 'private' }),
          },
        ],
      },
    });
  }

  _userPress = userIndex => {
    this.searchTextInput.focus();
    this.setState({ selectedUserIndex: userIndex });
  }

  _toolbarPress = () => {
    this.searchTextInput.focus();
    this.setState({ selectedUserIndex: null });
  }

  _toggleSearchUsersList = show => {
    this.setState({ showSearchUsersList: show });
  }

  render() {
    const { editable, style } = this.props;
    const { accessLevel, title, selectedUserIndex, search, selectedUsers, searchUsers, showSearchUsersList, loadingSearch } = this.state;

    return (
      <View>
        <TouchableWithoutFeedback onPress={this._toolbarPress}>
          <View style={[ styles.container, style ]}>
            <Text style={styles.labelText}>{(accessLevel === 'protected' ? 'Invite:' : 'To:')}</Text>

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
              onFocus={() => this._toggleSearchUsersList(true)}
              onBlur={() => this._toggleSearchUsersList(false)}
              editable={editable !== undefined ? editable : true}
              placeholder={(!selectedUsers.length && (!accessLevel || accessLevel === 'public')) ? 'The World' : ''}
              returnKeyType={'done'}
              value={search}
              style={styles.textInput}
              ref={component => this.searchTextInput = component}
            />

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
                  <Text style={styles.accessLevelButtonText}>V.I.P.</Text>
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
          </View>
        </TouchableWithoutFeedback>

        {accessLevel !== 'private' && (
          <TouchableWithoutFeedback onPress={() => this.titleTextInput.focus()}>
            <View style={styles.container}>
              <Text style={styles.labelText}>Title:</Text>

              <TextInput
                onChangeText={text => this.setState({ title: text })}
                placeholder={'What do you want to talk about?'}
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
          <BabbleConversationUserList
            loading={loadingSearch}
            users={searchUsers}
            disableNoResultsMessage={!search}
            noResultsMessage={'No users found'}
            onPress={this.addUser}
            keyboardShouldPersistTaps={'always'}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accessLevelButton: {
    alignItems: 'center',
    borderColor: '#2A99CC',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 4,
    position: 'absolute',
    right: 15,
    top: 17,
  },
  accessLevelButtonIcon: {
    color: '#2A99CC',
  },
  accessLevelButtonText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
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
  container: {
    alignItems: 'center',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    width: '100%',
  },
  labelText: {
    color: '#909090',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    marginRight: 10,
  },
  nameSelectedText: {
    color: '#FFFFFF',
  },
  nameText: {
    color: '#2A99CC',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 14,
  },
  textInput: {
    color: '#404040',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 16,
    marginLeft: 5,
    paddingVertical: 5,
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
});
