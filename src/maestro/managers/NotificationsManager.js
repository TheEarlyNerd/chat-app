import { Platform, Alert } from 'react-native';
import { Manager } from 'react-native-maestro';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

const APNS_TOKEN_KEY = 'APNS_TOKEN';
const FCM_REGISTRATION_ID_KEY = 'FCM_REGISTRATION_ID';

export default class NotificationsManager extends Manager {
  static get instanceKey() {
    return 'notificationsManager';
  }

  static initialStore = {
    apnsToken: null,
    fcmRegistrationId: null,
    iosPermissionsDeferred: false,
  }

  constructor(maestro) {
    super(maestro);

    const { asyncStorageHelper } = this.maestro.helpers;

    asyncStorageHelper.getItem(APNS_TOKEN_KEY).then(apnsToken => {
      this.updateStore({ apnsToken });
    });

    asyncStorageHelper.getItem(FCM_REGISTRATION_ID_KEY).then(fcmRegistrationId => {
      this.updateStore({ fcmRegistrationId });
    });

    PushNotification.configure({
      onRegister: this._registeredForNotifications,
      onNotification: this._receivedNotification,
      onError: error => console.log(error),
      requestPermissions: Platform.OS === 'android',
    });
  }

  get storeName() {
    return 'notifications';
  }

  requestIOSPermissions() {
    if (Platform.OS === 'ios' && !this.store.apnsToken) {
      PushNotification.requestPermissions();
    }
  }

  deferIOSPermissions() {
    this.updateStore({ iosPermissionsDeferred: true });
  }

  iosPermissionsEnabled() {
    return !!this.store.apnsToken;
  }

  setBadgeNumber(number) {
    PushNotification.setApplicationBadgeNumber(number);
  }

  /*
   * Helpers
   */

  _registeredForNotifications = token => {
    Alert.alert('notification token', JSON.stringify(token));
    console.log(token);

    const { asyncStorageHelper } = this.maestro.helpers;
    const apnsToken = (token.os === 'ios') ? token.token : null;
    const fcmRegistrationId = (token.os === 'android') ? token.token : null;

    this.updateStore({ apnsToken, fcmRegistrationId });

    asyncStorageHelper.setItem(APNS_TOKEN_KEY, apnsToken);
    asyncStorageHelper.setItem(FCM_REGISTRATION_ID_KEY, fcmRegistrationId);

    this.maestro.dispatchEvent('NOTIFICATIONS:REGISTERED', token);
  }

  _receivedNotification = notification => {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }
}
