import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { BabbleUserAvatar, BabbleUserList } from './';
import maestro from '../maestro';

const { userManager } = maestro.managers;

export default class BabbleUserSelectionToolbar extends Component {
  state = {
    selectedUserIndex: null,
    textInputValue: '',
    selectedUsers: [],
    searchUsers: [],
    loadingSearch: false,
  }

  textInput = null;
  textInputTimeout = null;
  lastKeyPress = null;

  componentWillUnmount() {
    clearTimeout(this.textInputTimeout);
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

  _search = (text) => {
    clearTimeout(this.textInputTimeout);

    if (!text) {
      return;
    }

    this.setState({ loadingSearch: true });

    this.textInputTimeout = setTimeout(async () => {
      const { selectedUsers } = this.state;
      const selectedUserIds = selectedUsers.map(selectedUser => selectedUser.id);
      const searchUsers = (await userManager.getSearchUsers(text)).filter(searchUser => {
        return !selectedUserIds.includes(searchUser.id);
      });

      this.setState({ searchUsers, loadingSearch: false });
    }, 500);
  }

  _userPress = userIndex => {
    this.textInput.focus();
    this.setState({ selectedUserIndex: userIndex });
  }

  _searchUserPress = user => {
    this.setState({
      textInputValue: '',
      selectedUsers: [ ...this.state.selectedUsers, user ],
      searchUsers: [],
    });
  }

  _toolbarPress = () => {
    this.textInput.focus();
    this.setState({ selectedUserIndex: null });
  }

  render() {
    const { label, placeholder, style } = this.props;
    const { selectedUserIndex, textInputValue, selectedUsers, searchUsers, loadingSearch } = this.state;

    return (
      <View>
        <TouchableWithoutFeedback onPress={this._toolbarPress}>
          <View style={[ styles.container, style ]}>
            <Text style={styles.labelText}>{label}</Text>

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
              placeholder={(!selectedUsers.length) ? placeholder : ''}
              returnKeyType={'done'}
              value={textInputValue}
              style={styles.textInput}
              ref={component => this.textInput = component}
            />
          </View>
        </TouchableWithoutFeedback>

        <BabbleUserList
          loading={loadingSearch}
          users={searchUsers}
          disableNoResultsMessage={!textInputValue}
          onPress={this._searchUserPress}
          keyboardShouldPersistTaps={'always'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
