import { Platform, Alert } from 'react-native';
import { Manager } from 'react-native-maestro';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

const APNS_TOKEN_KEY = 'APNS_TOKEN';
const FCM_REGISTRATION_ID_KEY = 'FCM_REGISTRATION_ID';
const NOTIFICATION_PERMISSIONS_REQUESTED_KEY = 'NOTIFICATION_PERMISSIONS_REQUESTED';
const NOTIFICATION_PERMISSIONS_STATE_KEY = 'NOTIFICATIONS_PERMISSIONS_STATE';

export default class NotificationsManager extends Manager {
  static get instanceKey() {
    return 'notificationsManager';
  }

  static initialStore = {
    apnsToken: null,
    fcmRegistrationId: null,
    permissionsRequested: false,
    permissionsDeferred: false,
    permissionsState: {
      alert: false,
      badge: false,
      sound: false,
    },
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

    asyncStorageHelper.getItem(NOTIFICATION_PERMISSIONS_REQUESTED_KEY).then(permissionsRequested => {
      this.updateStore({ permissionsRequested });
    });

    asyncStorageHelper.getItem(NOTIFICATION_PERMISSIONS_STATE_KEY).then(permissionsState => {
      this.updateStore({ permissionsState }); // TODO: check permissions can delay, so we need to cache to prevent weird races
    });

    PushNotification.configure({
      onRegister: this._registeredForNotifications,
      onNotification: this._receivedNotification,
      requestPermissions: Platform.OS === 'android',
    });

    this.checkAndSyncPermissions();
  }

  get storeName() {
    return 'notifications';
  }

  async requestPermissions() {
    const { deviceHelper, asyncStorageHelper } = this.maestro.helpers;

    if (Platform.OS === 'ios' && await deviceHelper.isEmulator()) {
      Alert.alert('Device Notifications Not Supported On IOS Emulator');
    }

    const permissionsState = await PushNotification.requestPermissions();

    asyncStorageHelper.setItem(NOTIFICATION_PERMISSIONS_REQUESTED_KEY, true);

    this._syncPermissionsState(permissionsState);
    this.updateStore({ permissionsRequested: true });

    this.maestro.dispatchEvent('NOTIFICATIONS:PROMPT_COMPLETE');
  }

  async checkAndSyncPermissions() {
    return new Promise(resolve => {
      PushNotification.checkPermissions(permissionsState => {
        this._syncPermissionsState(permissionsState);
        resolve(permissionsState);
      });
    });
  }

  deferPermissions() {
    this.updateStore({ permissionsDeferred: true });
  }

  permissionsDeferred() {
    return !!this.store.permissionsDeferred;
  }

  permissionsEnabled() {
    const { store } = this;

    return store.permissionsState.alert && (store.apnsToken || store.fcmRegistrationId);
  }

  permissionsRequested() {
    return !!this.store.permissionsRequested;
  }

  setBadgeNumber(number) {
    PushNotification.setApplicationBadgeNumber(number);
  }

  /*
   * Helpers
   */

  _registeredForNotifications = token => {
    const { asyncStorageHelper } = this.maestro.helpers;
    const apnsToken = (Platform.OS === 'ios') ? token.token : null;
    const fcmRegistrationId = (Platform.OS === 'android') ? token.token : null;

    this.updateStore({ apnsToken, fcmRegistrationId });

    asyncStorageHelper.setItem(APNS_TOKEN_KEY, apnsToken);
    asyncStorageHelper.setItem(FCM_REGISTRATION_ID_KEY, fcmRegistrationId);

    this.maestro.dispatchEvent('NOTIFICATIONS:REGISTERED', token);
  }

  _receivedNotification = notification => {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }

  _syncPermissionsState = permissionsState => {
    const { asyncStorageHelper } = this.maestro.helpers;

    asyncStorageHelper.setItem(NOTIFICATION_PERMISSIONS_STATE_KEY, permissionsState);

    this.updateStore({ permissionsState });
  }
}
