import { Helper } from 'react-native-maestro';
import AsyncStorage from '@react-native-community/async-storage';

export default class AsyncStorageHelper extends Helper {
  static get instanceKey() {
    return 'asyncStorageHelper';
  }

  async getItem(key) {
    let item = await AsyncStorage.getItem(key);

    try {
      item = JSON.parse(item);
    } catch (error) {
      console.error(error);
    }

    return item;
  }

  setItem(key, value) {
    value = (typeof value !== 'string') ? JSON.stringify(value) : value;

    return AsyncStorage.setItem(key, value);
  }
}
