import { Manager } from 'react-native-maestro';
import Amplify, { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

export default class EventsManager extends Manager {
  static get instanceKey() {
    return 'eventsManager';
  }

  static initialStore = {
    subscriptions: [],
  }

  get storeName() {
    return 'events';
  }

  constructor(maestro) {
    super(maestro);

    Amplify.configure({
      Auth: {
        identityPoolId: 'us-east-2:74e1dac7-bef8-49ee-b3cf-fa9330f5bdc4',
        region: 'us-east-2',
      },
    });

    Amplify.addPluggable(new AWSIoTProvider({
      aws_pubsub_region: 'us-east-2',
      aws_pubsub_endpoint: 'wss://aia9sasq9hvwi-ats.iot.us-east-2.amazonaws.com/mqtt',
    }));
  }

  subscribe(topic) {
    const existingSubscription = this._getSubscription(topic);

    if (existingSubscription) {
      return existingSubscription;
    }

    this._addSubscription({
      topic,
      instance: PubSub.subscribe(topic).subscribe({
        next: this._onSubscriptionMessage,
        error: this._onSubscriptionError,
        close: this._onSubscriptionClose,
      }),
    });
  }

  unsubscribe(topic) {
    this._removeSubscription(topic);
  }

  unsubscribeAll() {
    this.store.subscriptions.forEach(subscription => {
      this._removeSubscription(subscription.topic);
    });
  }

  /*
   * Helpers
   */

  _addSubscription = ({ topic, instance }) => {
    const subscriptions = [ ...this.store.subscriptions ];

    subscriptions.push({ topic, instance });

    this.updateStore({ subscriptions });
  }

  _removeSubscription = topic => {
    const subscription = this._getSubscription(topic);

    subscription.instance.unsubscribe();

    this.updateStore({
      subscriptions: this.store.subscriptions.filter(subscription => (
        subscription.topic !== topic
      )),
    });
  }

  _getSubscription = topic => {
    return this.store.subscriptions.find(subscription => (
      subscription.topic === topic
    ));
  }

  _onSubscriptionMessage = message => {
    console.log('mqtt message', message);
  }

  _onSubscriptionError = error => {
    console.log('mqtt error', error);
  }

  _onSubscriptionClose = () => {
    console.log('mqtt closed');
  }
}
