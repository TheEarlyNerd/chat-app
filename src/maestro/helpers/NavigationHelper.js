import { Helper } from 'react-native-maestro';
import { StackActions } from '@react-navigation/native';

export default class NavigationHelper extends Helper {
  static get instanceKey() {
    return 'navigationHelper';
  }

  _navigation = null;

  push(routeName, params) {
    this._navigation.dispatch(StackActions.push(routeName, params));
  }

  reset(routeName, params) {
    this.maestro.dispatchEvent('NAVIGATION_RESET', { routeName, params });
  }

  setNavigation(navigation) {
    this._navigation = navigation;
  }
}
