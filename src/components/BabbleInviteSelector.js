import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BabbleSearchField, BabbleButton, BabbleConnectDeviceContactsView, BabbleConversationUserList } from './';
import maestro from '../maestro';

const { deviceContactsManager, conversationsManager, userManager } = maestro.managers;

export default class BabbleInviteSelector extends Component {
  state = {
    search: '',
    invitedUsers: [],
    searchUsers: [],
    contactUsers: [],
  }

  searchTimeout = null;

  componentDidMount() {
    maestro.link(this);

    if (deviceContactsManager.requestedPermission()) {
      deviceContactsManager.loadContacts();
    }
  }

  componentWillUnmount() {
    maestro.unlink(this);

    clearTimeout(this.searchTimeout);
  }

  receiveStoreUpdate({ deviceContacts }) {
    const { searchUsers } = this.state;
    const { contacts } = deviceContacts;

    if (contacts) {
      this.setState({
        searchUsers: (!searchUsers.length) ? contacts : searchUsers,
        contactUsers: contacts,
      });
    }
  }

  receiveEvent(name, value) {
    if (name === 'APP_STATE_CHANGED' && value === 'active' && deviceContactsManager.requestedPermission() && !deviceContactsManager.grantedPermission()) {
      deviceContactsManager.loadContacts();
    }
  }

  _getSearchUsers = async search => {
    return await userManager.searchUsers(search);
  }

  _getContactUsers = search => {
    const { contactUsers } = this.state;

    if (!contactUsers?.length) {
      return [];
    }

    return contactUsers.filter(contactUser => (
      !search || contactUser.name.includes(search)
    ));
  }

  _inviteUser = user => {
    const { conversationId } = this.props;
    const invitedUsers = [ ...this.state.invitedUsers ];

    conversationsManager.createConversationUser({
      conversationId,
      userId: (!user.isPhoneContact) ? user.id : null,
      phoneUser: (user.isPhoneContact) ? {
        name: user.name,
        phone: user.phone,
      } : null,
    });

    invitedUsers.push(user);

    this.setState({ invitedUsers });
  }

  _search = search => {
    clearTimeout(this.searchTimeout);

    this.setState({
      search,
      searchUsers: [],
      loadingSearch: true,
    });

    this.searchTimeout = setTimeout(async () => {
      const searchAppUsers = (search) ? await this._getSearchUsers(search) : [];
      const searchContactUsers = this._getContactUsers(search);
      const searchUsers = [ ...searchAppUsers, ...searchContactUsers ].filter(user => (
        !!user.phone || !!user.username
      )).sort((a, b) => (
        (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0
      ));

      this.setState({ searchUsers, loadingSearch: false });
    }, 350);
  }

  _renderUserAction = user => {
    const { invitedUsers } = this.state;
    const isInvited = invitedUsers.some(invitedUser => invitedUser.id === user.id);

    return (
      <BabbleButton
        disabled={isInvited}
        inverted={isInvited}
        onPress={() => this._inviteUser(user)}
        textStyle={styles.inviteButtonText}
        style={styles.inviteButton}
      >
        {isInvited ? 'Invited' : 'Send Invite'}
      </BabbleButton>
    );
  }

  render() {
    const { search, searchUsers, loadingSearch } = this.state;
    const canAccessContacts = deviceContactsManager.grantedPermission();

    return (
      <View style={styles.container}>
        <View style={styles.searchFieldContainer}>
          <BabbleSearchField
            disableCancelButton
            onChangeText={this._search}
            returnKeyType={'done'}
            placeholder={'Search users...'}
            value={search}
            style={styles.searchField}
          />
        </View>

        {(!!search || canAccessContacts) && (
          <BabbleConversationUserList
            loading={loadingSearch}
            renderUserAction={this._renderUserAction}
            users={searchUsers}
            userStyle={styles.userStyle}
            contentContainerStyle={styles.listContainer}
            style={styles.list}
          />
        )}

        {!canAccessContacts && !search && (
          <BabbleConnectDeviceContactsView
            promptText={'Spice things up by inviting friends and family to the conversation.'}
            contentContainerStyle={styles.connectDeviceContactsContainer}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  connectDeviceContactsContainer: {
    flex: 1,
  },
  container: {
    height: 350,
  },
  inviteButton: {
    height: 30,
    opacity: 1,
    width: 90,
  },
  inviteButtonText: {
    fontSize: 14,
  },
  list: {
  },
  listContainer: {
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  searchFieldContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  userStyle: {
    paddingHorizontal: 0,
  },
});
