import { Manager } from 'react-native-maestro';
import Amplify, { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

export default class EventsManager extends Manager {
  static get instanceKey() {
    return 'eventsManager';
  }

  static initialStore = {}

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
}
