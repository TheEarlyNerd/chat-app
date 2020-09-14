import { Manager } from 'react-native-maestro';
import Amplify from 'aws-amplify';
import PahoMQTT from 'paho-mqtt';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

const retryTime = 2 * 1000; // 2 seconds

export default class EventsManager extends Manager {
  static get instanceKey() {
    return 'eventsManager';
  }

  static initialStore = {
    subscriptionTopics: [],
    connected: false,
  }

  iotProvider = null;
  mqttClient = null;

  constructor(maestro) {
    super(maestro);

    Amplify.configure({
      Auth: {
        identityPoolId: 'us-east-2:74e1dac7-bef8-49ee-b3cf-fa9330f5bdc4',
        region: 'us-east-2',
      },
    });

    this.iotProvider = new AWSIoTProvider({
      aws_pubsub_region: 'us-east-2',
      aws_pubsub_endpoint: 'wss://aia9sasq9hvwi-ats.iot.us-east-2.amazonaws.com/mqtt',
    });

    this._connect();
  }

  get storeName() {
    return 'events';
  }

  receiveEvent(name, value) {
    if (name === 'APP_NETWORK_STATE_CHANGED' && !value.isConnected && this.store.connected) {
      this.mqttClient.disconnect();
    }
  }

  subscribe(topic) {
    if (!this.store.connected) {
      return this._retry(() => this.subscribe(topic));
    }

    if (this._isSubscribedToTopic(topic)) {
      console.log('MQTT: Already subscribed to', topic);
      return;
    }

    console.log('MQTT: Subscribing to', topic);

    this.mqttClient.subscribe(topic, {
      onSuccess: () => this._addSubscribedTopic(topic),
      onFailure: () => this._retry(() => this.subscribe(topic)),
      qos: 1,
    });
  }

  unsubscribe(topic) {
    if (!this.store.connected) {
      return this._retry(() => this.unsubscribe(topic));
    }

    if (!this._isSubscribedToTopic(topic)) {
      return;
    }

    console.log('MQTT: Unsubscribing from', topic);

    this._removeSubscribedTopic(topic);

    this.mqttClient.unsubscribe(topic, {
      onFailure: () => this._retry(() => this.unsubscribe(topic)),
    });
  }

  unsubscribeAll() {
    if (!this.store.connected) {
      return this._retry(() => this.unsubscribeAll());
    }

    this.store.subscriptionTopics.forEach(subscriptionTopic => {
      this.unsubscribe(subscriptionTopic);
    });
  }

  /*
   * Helpers
   */

  _connect = async () => {
    const endpointUrl = await this.iotProvider.endpoint;

    if (this.store.connected) {
      return;
    }

    this.mqttClient = new PahoMQTT.Client(endpointUrl, this.iotProvider.clientId);
    this.mqttClient.onConnectionLost = this._disconnected;
    this.mqttClient.onMessageArrived = this._receivedMessage;
    this.mqttClient.connect({
      timeout: 10,
      useSSL: true,
      mqttVersion: 4,
      reconnect: false,
      keepAliveInterval: 5,
      onFailure: () => this._retry(this._connect),
      onSuccess: this._connected,
    });
  }

  _connected = () => {
    this.maestro.dispatchEvent('EVENTS_CONNECTED', true);

    this._resubscribeToTopics();

    console.log('MQTT: Connected');

    this.updateStore({ connected: true });
  }

  _disconnected = error => {
    this.maestro.dispatchEvent('EVENTS_CONNECTED', false);

    console.log('MQTT Disconnected', error);

    this.updateStore({ connected: false });

    this._reconnect();
  }

  _reconnect = () => {
    if (!this.mqttClient) {
      console.log('MQTT: No client for reconnect');
      return;
    }

    console.log('MQTT: Reconnecting');

    this._connect();
  }

  _receivedMessage = message => {
    const { activityManager, roomsManager } = this.maestro.managers;
    const { dataHelper } = this.maestro.helpers;
    const messageObject = JSON.parse(message.payloadString);
    const event = messageObject.event;
    const data = dataHelper.normalizeDataObject(messageObject.data);

    if (event === 'ROOM_CREATE') {
      roomsManager._addUpdateRecentRoom(data);

      if (data.accessLevel === 'private') {
        roomsManager._addUpdatePrivateRoom(data);
      }
    }

    if (event === 'ROOM_UPDATE') {
      roomsManager._updateRoom({
        roomId: data.id,
        fields: data,
      });
    }

    if (event === 'ROOM_DELETE') {
      roomsManager._removeFromAllRoomTypes(data.id);
    }

    if (event === 'ROOM_MESSAGE_CREATE') {
      roomsManager._addMessageToRoom({
        roomId: data.roomId,
        message: data,
      });
    }

    if (event === 'ROOM_MESSAGE_UPDATE') {

    }

    if (event === 'ROOM_MESSAGE_DELETE') {
      roomsManager._removeMessageFromRoom({
        roomId: data.roomId,
        roomMessageId: data.id,
      });
    }

    if (event === 'ROOM_MESSAGE_TYPING_START') {
      roomsManager._addTypingUserToRoom({
        roomId: data.user.roomId,
        user: data.user,
      });
    }

    if (event === 'ROOM_MESSAGE_REACTION_CREATE') {
      roomsManager._addReactionToRoomMessage({
        roomId: data.roomId,
        roomMessageId: data.roomMessageId,
        reaction: data,
      });
    }

    if (event === 'ROOM_MESSAGE_REACTION_DELETE') {
      roomsManager._removeReactionFromRoomMessage({
        userId: data.userId,
        roomId: data.roomId,
        roomMessageId: data.roomMessageId,
        roomMessageReactionId: data.id,
        reaction: data.reaction,
      });
    }

    if (event === 'USER_ACTIVITY_CREATE') {
      activityManager._addActivity(data);
    }
  }

  _addSubscribedTopic = topic => {
    const subscriptionTopics = this.store.subscriptionTopics.filter(subscriptionTopic => (
      subscriptionTopic !== topic
    ));

    subscriptionTopics.push(topic);

    this.updateStore({ subscriptionTopics });
  }

  _removeSubscribedTopic = topic => {
    this.updateStore({
      subscriptionTopics: this.store.subscriptionTopics.filter(subscriptionTopic => (
        subscriptionTopic !== topic
      )),
    });
  }

  _isSubscribedToTopic = topic => {
    return this.store.subscriptionTopics.includes(topic);
  }

  _resubscribeToTopics = () => {
    const subscriptionTopics = [ ...this.store.subscriptionTopics ];

    this.updateStore({ subscriptionTopics: [] });

    subscriptionTopics.forEach(subscriptionTopic => {
      this.subscribe(subscriptionTopic);
    });
  }

  _retry = func => {
    setTimeout(func, retryTime);
  }
}
