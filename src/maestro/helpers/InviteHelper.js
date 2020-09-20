import { Helper } from 'react-native-maestro';
import { Platform, Linking } from 'react-native';

export default class InviteHelper extends Helper {
  static get instanceKey() {
    return 'inviteHelper';
  }

  sendInvite = phoneNumbers => {
    const smsDivider = Platform.select({ ios: '&', default: '?' });
    const smsMessage = `Hey, I invited you to a chat room on Babble I think you'll like. Please put the app on your phone to join it: https://www.usebabble.com/`;

    Linking.openURL(`sms:${phoneNumbers.join(',')}${smsDivider}body=${smsMessage}`);
  }
}
