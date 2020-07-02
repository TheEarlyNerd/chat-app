import { Manager } from 'react-native-maestro';

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
  }

  iosPermissionsEnabled() {
    return !!this.store.apnsToken;
  }
}
