import React, { Component } from 'react';
import { View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BabbleUserPreview, BabbleSettingField, BabbleViewMoreButton } from '../components';
import { ChevronRightIcon } from '../components/icons';
import maestro from '../maestro';

const { conversationsManager } = maestro.managers;
const { navigationHelper, interfaceHelper } = maestro.helpers;

export default class ConversationDetailsScreen extends Component {
  state = {
    title: this.props.route.params.conversation.title,
    conversationUsers: null,
  }

  async componentDidMount() {
    const { conversation } = this.props.route.params;
    const { authConversationUser } = conversation;
    const conversationUsers = await conversationsManager.getConversationUsers(conversation.id);

    if (authConversationUser && authConversationUser.permissions.includes('CONVERSATION_ADMIN')) {
      this.props.navigation.setOptions({
        rightButtonTitle: 'Save',
        onRightButtonPress: this._savePress,
      });
    }

    this.setState({ conversationUsers });
  }

  _deletePress = () => {
    Alert.alert('Delete this conversation?', 'Are you sure you want to permanently delete this conversation? This cannot be undone.', [
      {
        text: 'Delete',
        onPress: async () => {
          const { conversation } = this.props.route.params;

          this.props.navigation.setOptions({ showRightLoading: true });
          await conversationsManager.deleteConversation(conversation.id);
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
    Alert.alert('Leave this conversation?', 'Are you sure you want to leave this conversation?', [
      {
        text: 'Leave',
        onPress: async () => {
          const { conversation } = this.props.route.params;

          this.props.navigation.setOptions({ showRightLoading: true });
          await conversationsManager.leaveConversation(conversation.id);
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
    Alert.alert('Report this conversation?', 'You should only report this conversation if it focuses on hate speech, racism, harming others or criminal activity.', [
      {
        text: 'Report',
        onPress: () => {
          Alert.alert('Reported Successfully', 'Thank you. This conversation has been reported.');
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
    const { conversation } = this.props.route.params;
    const { title } = this.state;

    navigation.setOptions({ showRightLoading: true });

    try {
      await conversationsManager.updateConversation({
        conversationId: conversation.id,
        fields: { title },
      });
    } catch (error) {
      interfaceHelper.showError({ message: error.message });

      return navigation.setOptions({ showRightLoading: false });
    }

    navigation.pop();
  }

  _openConversationUsers = () => {
    const { conversation } = this.props.route.params;

    navigationHelper.push('ConversationUsers', {
      conversationId: conversation.id,
    });
  }

  _getAccessLevelText = () => {
    const { accessLevel } = this.props.route.params.conversation;

    if (accessLevel === 'public') {
      return 'Public - Anyone can join this conversation, send and react to messages, and invite others.';
    }

    if (accessLevel === 'protected') {
      return 'V.I.P. - Only V.I.Ps invited to this conversation can send messages. Anyone can join this conversation to react to messages.';
    }

    if (accessLevel === 'private') {
      return 'Private - Only participants can see this conversation, send messages and react to messages.';
    }
  }

  render() {
    const { conversation } = this.props.route.params;
    const { authConversationUser } = conversation;
    const { title, conversationUsers } = this.state;

    return (
      <KeyboardAwareScrollView
        extraHeight={150}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.contentContainer}
      >
        <BabbleSettingField
          label={'Title'}
          editable={!!authConversationUser && authConversationUser.permissions.includes('CONVERSATION_ADMIN')}
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
            user={conversation.user}
            style={styles.participant}
          />
        </BabbleSettingField>

        <View style={styles.border} />

        <BabbleSettingField
          label={`Participants (${conversation.usersCount})`}
          onPress={(conversation.usersCount > 5) ? this._openConversationUsers : null}
          IconComponent={(conversation.usersCount > 5) ? ChevronRightIcon : null}
          style={styles.participantsSettingField}
        >
          {!conversationUsers && (
            <ActivityIndicator size={'large'} style={styles.loadingIndicator} />
          )}

          {!!conversationUsers && conversationUsers.map(conversationUser => (
            <BabbleUserPreview
              user={conversationUser.user}
              style={styles.participant}
              key={conversationUser.id}
            />
          ))}

          {!!conversationUsers && conversation.usersCount > 5 && (
            <BabbleViewMoreButton
              onPress={this._openConversationUsers}
              style={styles.viewMoreButton}
            />
          )}
        </BabbleSettingField>

        {!!authConversationUser && !authConversationUser.permissions.includes('CONVERSATION_ADMIN') && (
          <>
            <BabbleSettingField
              onPress={this._leavePress}
              label={'Leave Conversation'}
              labelStyle={styles.red}
            />

            <View style={styles.border} />
          </>
        )}

        {(!authConversationUser || !authConversationUser.permissions.includes('CONVERSATION_ADMIN')) && (
          <BabbleSettingField
            onPress={this._reportPress}
            label={'Report Conversation'}
            labelStyle={styles.red}
          />
        )}

        {!!authConversationUser && authConversationUser.permissions.includes('CONVERSATION_ADMIN') && (
          <BabbleSettingField
            onPress={this._deletePress}
            label={'Delete Conversation'}
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
    marginTop: 15,
  },
});
