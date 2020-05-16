import { Manager } from 'react-native-maestro';

export default class ConversationsManager extends Manager {
  static get instanceKey() {
    return 'conversationsManager';
  }

  static initialStore = {
    activeConversation: null,
    conversations: null,
  }

  get storeName() {
    return 'conversations';
  }

  async loadActiveConversation(conversationId) {

  }

  async loadConversations() {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: '/conversations' });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this.updateStore({ conversations: response.body });
  }

  async createConversation({ accessLevel, users, message }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.post({
      path: '/conversations',
      data: { accessLevel, users, message },
    });

    if (![ 200, 409 ].includes(response.code)) {
      throw new Error(response.body);
    }

    return response.body;
  }
}
