import { Helper } from 'react-native-maestro';
import { StackActions, CommonActions } from '@react-navigation/native';

export default class NavigationHelper extends Helper {
  static get instanceKey() {
    return 'navigationHelper';
  }

  _navigation = null;
  _splitSidebarNavigation = null;
  _splitContentNavigation = null;

  pop(numberOfScreens = 1, navigationType) {
    const navigation = this._getNavigationByType(navigationType);

    navigation.dispatch(StackActions.pop(numberOfScreens));
  }

  push(routeName, params, navigationType) {
    const navigation = this._getNavigationByType(navigationType);

    navigation.dispatch(StackActions.push(routeName, params));
  }

  reset(routeName, params, navigationType) {
    const navigation = this._getNavigationByType(navigationType);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: routeName,
            params: { animationEnabled: false, ...params },
          },
        ],
      }),
    );
  }

  replace(routeName, params, navigationType) {
    const navigation = this._getNavigationByType(navigationType);

    navigation.dispatch(StackActions.replace(routeName, params));
  }

  navigate(routeName, params, navigationType) { // won't allow same route on the stack more than 1 time whereas push will.
    const navigation = this._getNavigationByType(navigationType);

    navigation.dispatch(CommonActions.navigate({
      name: routeName,
      params,
    }));
  }

  resetRoot(routeName, params) {
    this.maestro.dispatchEvent('ROOT_NAVIGATION_RESET', { routeName, params });
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

  _getNavigationByType = navigationType => {
    if (navigationType === 'sidebar' && this._splitSidebarNavigation) {
      return this._splitSidebarNavigation;
    }

    if (navigationType === 'content' && this._splitContentNavigation) {
      return this._splitContentNavigation;
    }

    return this._navigation;
  }
}
