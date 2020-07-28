import React, { Component } from 'react';
import { SafeAreaView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { BabbleConversationComposerToolbar, BabbleConversationHeaderTitle, BabbleConversation, BabbleConversationMessageComposerToolbar } from '../components';
import { AlertTriangleIcon, RepeatIcon, MoreVerticalIcon } from '../components/icons';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;
const { interfaceHelper } = maestro.helpers;

export default class ConversationScreen extends Component {
  conversationComposer = null;
  messageComposer = null;
  typingTimeout = null;

  state = {
    conversation: null,
    showConversationComposer: !this.props.route?.params?.conversationId,
    loading: false,
  }

  componentDidMount() {
    maestro.link(this);

    const conversationId = this.props.route?.params?.conversationId;
    const toUsers = this.props.route?.params?.toUsers;
    const title = this.props.route?.params?.title;

    if (!title) {
      this.props.navigation.setOptions({
        title: (conversationId) ? <ActivityIndicator color={'#FFFFFF'} /> : 'New Conversation',
      });
    }

    if (conversationId) {
      conversationsManager.loadActiveConversation(conversationId); // handle non existent convos?

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

  receiveStoreUpdate({ conversations, user }) {
    const { activeConversations } = conversations;
    const conversationId = this.state.conversation?.id || this.props.route?.params?.conversationId;

    if (!Array.isArray(activeConversations) || !conversationId) {
      return;
    }

    const conversation = activeConversations.find(conversation => conversation.id === conversationId);

    this._setConversation(conversation);
  }

  _showMoreActionSheet = () => {
    const { id, authUserConversationRepost } = this.state.conversation;

    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: {
        actions: [
          {
            iconComponent: RepeatIcon,
            text: (!authUserConversationRepost) ? 'Repost' : 'Delete Repost',
            subtext: 'Your repost of this conversation will be deleted and removed from the feeds of your followers.',
            onPress: () => {
              if (!authUserConversationRepost) {
                conversationsManager.createConversationRepost(id);
                Alert.alert('Reposted', 'This conversation has been reposted to your profile and feeds of your followers.');
              } else {
                conversationsManager.deleteConversationRepost(id);
                Alert.alert('Repost Deleted', 'This conversation repost has been deleted and removed from your profile and the feed of your followers.');
              }
            },
          },
        ],
      },
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
    const { conversation } = this.state;
    const { accessLevel, title, selectedUsers } = this.conversationComposer || {};

    if (conversation) {
      this.messageComposer.clear();

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
      createdConversation = await conversationsManager.createConversation({
        accessLevel,
        title,
        userIds: selectedUsers.map(selectedUser => selectedUser.id),
        message: { text, attachments, embeds },
      });
    } catch (error) {
      this.setState({ loading: false });

      return interfaceHelper.showError({ message: error.message });
    }

    this.messageComposer.clear();
    this._setConversation(createdConversation);
    this.setState({
      showConversationComposer: false,
      loading: false,
    });
  }

  _onUserSelectionChange = async ({ selectedUsers, accessLevel }) => {
    this._setConversation(null);

    if (accessLevel === 'private' && selectedUsers.length) {
      const userIds = selectedUsers.map(user => user.id);
      const conversation = await conversationsManager.getPrivateConversationByUserIds(userIds);

      this.setState({ conversation });
    }
  }

  render() {
    const { conversation, showConversationComposer, loading } = this.state;
    const { conversationMessages, conversationTypingUsers } = conversation || {};

    return (
      <SafeAreaView style={styles.container}>
        {showConversationComposer && (
          <BabbleConversationComposerToolbar
            editable={!loading}
            onUserSelectionChange={this._onUserSelectionChange}
            ref={component => this.conversationComposer = component}
          />
        )}

        <BabbleConversation
          messages={conversationMessages}
          typingUsers={conversationTypingUsers}
        />

        <BabbleConversationMessageComposerToolbar
          onTyping={this._onTyping}
          onSubmit={this._onMessageSubmit}
          loading={loading}
          ref={component => this.messageComposer = component}
        />
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
