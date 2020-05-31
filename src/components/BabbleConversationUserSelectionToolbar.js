import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { BabbleUserAvatar, BabbleUserList } from './';
import { UsersIcon, MessageCircleIcon, LockIcon, ChevronDownIcon } from './icons';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { interfaceHelper } = maestro.helpers;

export default class BabbleUserSelectionToolbar extends Component {
  state = {
    accessLevel: null,
    selectedUserIndex: null,
    textInputValue: '',
    selectedUsers: [],
    searchUsers: [],
    showSearchUsersList: false,
    loadingSearch: false,
  }

  textInput = null;
  textInputTimeout = null;
  lastKeyPress = null;

  componentWillUnmount() {
    clearTimeout(this.textInputTimeout);
  }

  get accessLevel() {
    return this.state.accessLevel || 'public';
  }

  get selectedUsers() {
    return this.state.selectedUsers;
  }

  _onKeyPress = ({ nativeEvent }) => {
    const { key } = nativeEvent;
    const { textInputValue } = this.state;

    this.lastKeyPress = key;

    if (key === 'Backspace' && !textInputValue.length) {
      this._onChangeText(textInputValue);
    }
  }

  _onChangeText = text => {
    const { selectedUserIndex, textInputValue, selectedUsers } = this.state;
    const state = {
      textInputValue: text,
      selectedUserIndex: null,
      searchUsers: [],
    };

    if (this.lastKeyPress === 'Backspace' && (!textInputValue.length || selectedUserIndex !== null)) {
      if (selectedUserIndex !== null) {
        state.selectedUsers = selectedUsers.filter((user, index) => index !== selectedUserIndex);
        state.textInputValue = '';
      } else if (selectedUsers.length > 0) {
        state.selectedUserIndex = selectedUsers.length - 1;
      }
    }

    this._search(text);

    this.setState(state);
  }

  _search = search => {
    clearTimeout(this.textInputTimeout);

    if (!search) {
      return this.setState({ loadingSearch: false });
    }

    this.setState({ loadingSearch: true });

    this.textInputTimeout = setTimeout(async () => {
      const { selectedUsers } = this.state;
      const selectedUserIds = selectedUsers.map(selectedUser => selectedUser.id);
      const searchUsers = (await userManager.getSearchUsers(search)).filter(searchUser => {
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
            subtext: 'Only people you invite to this conversation can send messages. Anyone can view this conversation and react to messages.',
            onPress: () => this.setState({ accessLevel: 'protected' }),
          },
          {
            iconComponent: LockIcon,
            text: 'Private',
            subtext: 'Only people you invite can view this conversation, send messages and react to messages.',
            onPress: () => this.setState({ accessLevel: 'private' }),
          },
        ],
      },
    });
  }

  _userPress = userIndex => {
    this.textInput.focus();
    this.setState({ selectedUserIndex: userIndex });
  }

  _searchUserPress = user => {
    this.setState({
      accessLevel: this.state.accessLevel || 'private',
      textInputValue: '',
      selectedUsers: [ ...this.state.selectedUsers, user ],
      searchUsers: [],
    });
  }

  _toolbarPress = () => {
    this.textInput.focus();
    this.setState({ selectedUserIndex: null });
  }

  _toggleSearchUsersList = show => {
    this.setState({ showSearchUsersList: show });
  }

  render() {
    const { style } = this.props;
    const { accessLevel, selectedUserIndex, textInputValue, selectedUsers, searchUsers, showSearchUsersList, loadingSearch } = this.state;

    return (
      <View>
        <TouchableWithoutFeedback onPress={this._toolbarPress}>
          <View style={[ styles.container, style ]}>
            <Text style={styles.labelText}>{(accessLevel === 'protected' ? 'Invite:' : 'To:')}</Text>

            {selectedUsers.map((selectedUser, index) => (
              <TouchableOpacity
                onPress={() => this._userPress(index)}
                key={index}
                style={[
                  styles.user,
                  (index === selectedUserIndex) ? styles.userSelected : null,
                ]}
              >
                <BabbleUserAvatar
                  avatarAttachment={selectedUser.avatarAttachment}
                  disabled
                  size={20}
                  style={styles.avatar}
                  activityIconStyle={styles.avatarActivityIcon}
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
              placeholder={(!selectedUsers.length && (!accessLevel || accessLevel === 'public')) ? 'The World' : ''}
              returnKeyType={'done'}
              value={textInputValue}
              style={styles.textInput}
              ref={component => this.textInput = component}
            />

            <TouchableOpacity onPress={this._accessLevelPress} style={styles.accessLevelButton}>
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

        {showSearchUsersList && (
          <BabbleUserList
            loading={loadingSearch}
            users={searchUsers}
            disableNoResultsMessage={!textInputValue}
            noResultsMessage={'No users found'}
            onPress={this._searchUserPress}
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
