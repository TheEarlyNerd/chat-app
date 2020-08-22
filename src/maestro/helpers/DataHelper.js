import { Helper } from 'react-native-maestro';
import * as RNLocalize from 'react-native-localize';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default class DataHelper extends Helper {
  static get instanceKey() {
    return 'dataHelper';
  }

  normalizeDataObject = dataObject => {
    const normalize = value => {
      if (typeof value !== 'object' || [ null, undefined ].includes(value)) {
        return value;
      }

      Object.keys(value).forEach(key => {
        if (typeof value[key] === 'object') {
          value[key] = normalize(value[key]);
        }

        if (Array.isArray(value[key])) {
          value[key] = value[key].map(item => normalize(item));
        }
      });

      if (value.createdAt) { value.createdAt = new Date(value.createdAt); }
      if (value.updatedAt) { value.updatedAt = new Date(value.updatedAt); }
      if (value.deletedAt) { value.deletedAt = new Date(value.deletedAt); }
      if (value.lastActiveAt) { value.lastActiveAt = new Date(value.lastActiveAt); }
      if (value.lastReadAt) { value.lastReadAt = new Date(value.lastReadAt); }
      if (value.lastViewedActivityAt) { value.lastViewedActivityAt = new Date(value.lastViewedActivityAt); }
      if (value.typingAt) { value.typingAt = new Date(value.typingAt); }
      if (value.closedAt) { value.closedAt = new Date(value.closedAt); }
      if (value.sentAt) { value.sentAt = new Date(value.sentAt); }

      return value;
    };

    dataObject = (Array.isArray(dataObject))
      ? dataObject.map(value => normalize(value))
      : normalize(dataObject);

    return dataObject;
  }

  normalizePhoneNumber = phoneNumber => {
    if (!phoneNumber) {
      return;
    }

    let parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);

    if (!parsedPhoneNumber) {
      parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, RNLocalize.getCountry());
    }

    if (!parsedPhoneNumber) {
      const deviceLocales = RNLocalize.getLocales();

      deviceLocales.forEach(({ countryCode }) => {
        if (!parsedPhoneNumber) {
          parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
        }
      });
    }

    return (parsedPhoneNumber) ? parsedPhoneNumber.number.replace('+', '') : false;
  }
}
