import React, { Component } from 'react';
import { SafeAreaView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { BabbleConversationComposerToolbar, BabbleConversationHeaderTitle, BabbleConversation, BabbleConversationMessageComposerToolbar, BabbleConversationViewerToolbar } from '../components';
import { AlertTriangleIcon, RepeatIcon, InfoIcon, MoreVerticalIcon } from '../components/icons';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;
const { navigationHelper, interfaceHelper } = maestro.helpers;

export default class ConversationScreen extends Component {
  conversation = null;
  conversationComposer = null;
  messageComposer = null;
  typingTimeout = null;

  state = {
    conversation: null,
    composingConversation: !this.props.route?.params?.conversationId,
    loading: false,
  }

  componentDidMount() {
    maestro.link(this);

    const params = this.props.route.params || {};
    const { conversationId, toUsers, title } = params;

    if (!title) {
      this.props.navigation.setOptions({
        title: (conversationId) ? <ActivityIndicator color={'#FFFFFF'} /> : 'New Conversation',
      });
    }

    if (conversationId) {
      conversationsManager.loadActiveConversation(conversationId); // handle non existent convos?

      this.props.navigation.addListener('blur', () => {
        conversationsManager.markConversationRead(conversationId);
      });

      this.props.navigation.setOptions({
        rightButtonComponent: <MoreVerticalIcon width={31} height={31} style={styles.moreIcon} />,
        onRightButtonPress: this._showMoreActionSheet,
      });
    }

    if (Array.isArray(toUsers)) {
      toUsers.forEach(user => this.conversationComposer.addUser(user));
    }
  }

  componentWillUnmount() {
    maestro.unlink(this);

    const conversationId = this.state.conversation?.id || this.props.route?.params?.conversationId;

    if (conversationId) {
      conversationsManager.removeActiveConversation(conversationId);
    }
  }

  receiveStoreUpdate({ conversations }) {
    const { activeConversations } = conversations;
    const conversationId = this.state.conversation?.id || this.props.route?.params?.conversationId;

    if (!Array.isArray(activeConversations) || !conversationId) {
      return;
    }

    const conversation = activeConversations.find(conversation => conversation.id === conversationId);

    this._setConversation(conversation);
  }

  receiveEvent(name, value) {
    const { conversation } = this.state;

    if (conversation && name === 'APP_STATE_CHANGED' && value === 'active') {
      this._loadNewMessages();
    }
  }

  _loadNewMessages = () => {
    const { conversation } = this.state;
    const { conversationMessages } = conversation;

    if (!conversation.id) {
      return [];
    }

    return conversationsManager.loadActiveConversationMessages({
      conversationId: conversation.id,
      queryParams: { after: conversationMessages[0].createdAt },
    });
  }

  _loadOldMessages = () => {
    const { conversation } = this.state;
    const { conversationMessages } = conversation;

    if (!conversation.id) {
      return []; // FIX: prevent autoload bug on new convo, could do something cleaner?
    }

    return conversationsManager.loadActiveConversationMessages({
      conversationId: conversation.id,
      queryParams: { before: conversationMessages[conversationMessages.length - 1].createdAt },
    });
  }

  _showMoreActionSheet = () => {
    const { conversation } = this.state;
    const { id, authUserConversationRepost } = conversation;
    const actions = [
      {
        iconComponent: InfoIcon,
        text: 'View Info',
        subtext: 'See additional details about this conversation and its participants.',
        onPress: () => {
          navigationHelper.push('ConversationInfo', { conversation });
        },
      },
    ];

    if (conversation.accessLevel !== 'private') {
      actions.unshift({
        iconComponent: RepeatIcon,
        text: (!authUserConversationRepost) ? 'Repost' : 'Delete Repost',
        subtext: (!authUserConversationRepost) ? 'This conversation will be reposted to your profile and the feeds of your followers.' : 'Your repost of this conversation will be deleted and removed from the feeds of your followers.',
        onPress: () => {
          if (!authUserConversationRepost) {
            conversationsManager.createConversationRepost(id);
            Alert.alert('Reposted', 'This conversation has been reposted to your profile and feeds of your followers.');
          } else {
            conversationsManager.deleteConversationRepost(id);
            Alert.alert('Repost Deleted', 'This conversation repost has been deleted and removed from your profile and the feeds of your followers.');
          }
        },
      });
    }

    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: { actions },
    });
  }

  _setConversation = conversation => {
    if (conversation) {
      this.props.navigation.setOptions({
        title: <BabbleConversationHeaderTitle conversation={conversation} />,
        rightButtonComponent: <MoreVerticalIcon width={31} height={31} style={styles.moreIcon} />,
        onRightButtonPress: this._showMoreActionSheet,
      });
    }

    this.setState({ conversation });
  }

  _onTyping = () => {
    const { conversation } = this.state;

    if (conversation && this.typingTimeout === null) {
      this.typingTimeout = setTimeout(() => this.typingTimeout = null, 2500);
      conversationsManager.createTypingEvent({ conversationId: conversation.id });
    }
  }

  _onMessageSubmit = async ({ text, attachments, embeds }) => {
    const { conversation, composingConversation } = this.state;
    const { accessLevel, title, selectedUsers } = this.conversationComposer || {};

    if (conversation) {
      this.conversation.scrollToEnd();
      this.messageComposer.clear();

      if (composingConversation) { // edge case for composing but sending to private & existing convo for users, see _onUserSelectionAccessLevelChange
        this.setState({ loading: true });
        this._setConversation(await conversationsManager.loadActiveConversation(conversation.id));
        this.setState({ loading: false, composingConversation: false });
      }

      return await conversationsManager.createConversationMessage({
        conversationId: conversation.id,
        text,
        attachments,
        embeds,
      });
    }

    if (!title && accessLevel !== 'private') {
      return interfaceHelper.showError({
        message: 'Please provide a title.',
        iconComponent: AlertTriangleIcon,
      });
    }

    let createdConversation = null;

    this.setState({ loading: true });

    try {
      const userIds = selectedUsers.map(selectedUser => (!selectedUser.isPhoneContact) ? selectedUser.id : null).filter(userId => !!userId);
      const phoneUsers = selectedUsers.map(selectedUser => (selectedUser.isPhoneContact) ? ({
        phone: selectedUser.phone,
        name: selectedUser.name,
      }) : null).filter(phoneUser => !!phoneUser);

      createdConversation = await conversationsManager.createConversation({
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
    this._setConversation(createdConversation);
    this.setState({
      composingConversation: false,
      loading: false,
    });
  }

  _onUserSelectionAccessLevelChange = async ({ selectedUsers, accessLevel }) => {
    this._setConversation(null);

    if (accessLevel === 'private' && selectedUsers.length) {
      const userIds = selectedUsers.map(user => (!user.isPhoneContact) ? user.id : null).filter(userId => !!userId);
      const phones = selectedUsers.map(user => (user.isPhoneContact) ? user.phone : null).filter(phone => !!phone);
      const conversation = await conversationsManager.getPrivateConversation({ userIds, phones });

      this.props.navigation.setOptions({ title: (conversation) ? 'New Message' : 'New Conversation' });

      this.setState({ conversation });
    } else {
      this.props.navigation.setOptions({ title: 'New Conversation' });
    }
  }

  render() {
    const { conversation, composingConversation, loading } = this.state;
    const { accessLevel, conversationMessages, conversationTypingUsers, authConversationUser } = conversation || {};
    const showViewerToolbar = accessLevel === 'protected' && (
      !authConversationUser || (
        !authConversationUser.permissions.includes('CONVERSATION_ADMIN') &&
        !authConversationUser.permissions.includes('CONVERSATION_MESSAGES_CREATE')
      )
    );

    return (
      <SafeAreaView style={styles.container}>
        {composingConversation && (
          <BabbleConversationComposerToolbar
            editable={!loading}
            onUserSelectionAccessLevelChange={this._onUserSelectionAccessLevelChange}
            ref={component => this.conversationComposer = component}
          />
        )}

        <BabbleConversation
          loadOldMessages={this._loadOldMessages}
          messages={conversationMessages}
          typingUsers={conversationTypingUsers}
          ref={component => this.conversation = component}
        />

        {!!conversation && showViewerToolbar && (
          <BabbleConversationViewerToolbar conversation={conversation} />
        )}

        {(!conversation || !showViewerToolbar) && (
          <BabbleConversationMessageComposerToolbar
            onTyping={this._onTyping}
            onSubmit={this._onMessageSubmit}
            loading={loading}
            ref={component => this.messageComposer = component}
          />
        )}
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
