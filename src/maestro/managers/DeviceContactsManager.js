import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { Manager } from 'react-native-maestro';

const CONTACTS_PERMISSION_KEY = 'CONTACTS_PERMISSION';

export default class DeviceContactsManager extends Manager {
  static get instanceKey() {
    return 'deviceContactsManager';
  }

  static initialStore = {
    contacts: null,
    permissionRequested: false,
    permissionGranted: false,
  }

  get storeName() {
    return 'deviceContacts';
  }

  constructor(maestro) {
    super(maestro);

    const { asyncStorageHelper } = this.maestro.helpers;

    asyncStorageHelper.getItem(CONTACTS_PERMISSION_KEY).then(permission => {
      this.updateStore({
        permissionRequested: permission !== null,
        permissionGranted: permission,
      });
    });
  }

  async loadContacts() {
    const load = () => {
      return new Promise(resolve => {
        Contacts.getAll((error, contacts) => {
          if (error) {
            return resolve(false);
          }

          this._syncPermission(!error);

          contacts = this._normalizeContacts(contacts);

          this.updateStore({ contacts });

          resolve(contacts);
        });
      });
    };

    if (Platform.OS === 'android') {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'To find friends, family and acquaintances, allow Babble to view your contacts.',
        buttonPositive: 'Allow',
      }).then(load);
    } else {
      return load();
    }
  }

  requestedPermission() {
    return this.store.permissionRequested;
  }

  grantedPermission() {
    return this.store.permissionGranted;
  }

  /*
   * Helpers
   */

  _syncPermission = granted => {
    const { asyncStorageHelper } = this.maestro.helpers;

    asyncStorageHelper.setItem(CONTACTS_PERMISSION_KEY, granted);

    this.updateStore({
      permissionRequested: true,
      permissionGranted: granted,
    });
  }

  _normalizeContacts = contacts => {
    const { dataHelper } = this.maestro.helpers;

    return contacts.map(contact => {
      const id = contact.recordID;
      const name = (contact.givenName || contact.familyName) ? `${contact.givenName} ${contact.familyName}` : null;
      const lastActiveAt = new Date();
      const avatarAttachment = (contact.hasThumbnail) ? { url: contact.thumbnailPath } : null;
      const phone = dataHelper.normalizePhoneNumber(
        contact.phoneNumbers.reduce((phone, phoneNumber, index) => {
          phone = (!phone && phoneNumber.label === 'main') ? phoneNumber.number : phone;
          phone = (!phone && phoneNumber.label === 'home') ? phoneNumber.number : phone;
          phone = (phoneNumber.label === 'mobile') ? phoneNumber.number : phone;
          phone = (!phone && contact.phoneNumbers.length - 1 === index) ? contact.phoneNumbers[0].number : phone;

          return phone;
        }, null),
      );

      return { id, name, lastActiveAt, avatarAttachment, phone, isPhoneContact: true };
    }).filter(contact => contact.phone && contact.name).sort((a, b) => {
      if (a.name > b.name) { return 1; }
      if (a.name < b.name) { return -1; }
      return 0;
    });
  }
}
