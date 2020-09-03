import { Helper } from 'react-native-maestro';
import { StackActions, CommonActions } from '@react-navigation/native';

export default class NavigationHelper extends Helper {
  static get instanceKey() {
    return 'navigationHelper';
  }

  _navigation = null;
  _splitSidebarNavigation = null;
  _splitContentNavigation = null;

  pop(numberOfScreens = 1) {
    this._navigation.dispatch(StackActions.pop(numberOfScreens));
  }

  push(routeName, params) {
    this._navigation.dispatch(StackActions.push(routeName, params));
  }

  navigate(routeName, params) { // won't allow same route on the stack more than 1 time whereas push will.
    this._navigation.dispatch(CommonActions.navigate({
      name: routeName,
      params,
    }));
  }

  reset(routeName, params) {
    this.maestro.dispatchEvent('NAVIGATION_RESET', { routeName, params });
  }

  setNavigation(navigation) {
    this._navigation = navigation;
  }

  setSplitSidebarNavigation(navigation) {
    this._splitSidebarNavigation = navigation;
  }

  setSplitContentNavigation(navigation) {
    this._splitContentNavigation = navigation;
  }
}
