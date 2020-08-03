import { Manager } from 'react-native-maestro';

export default class ActivityManager extends Manager {
  static get instanceKey() {
    return 'activityManager';
  }

  static initialStore = {
    activity: null,
  }

  get storeName() {
    return 'activity';
  }

  async loadActivity(viewed) {
    const { apiHelper } = this.maestro.helpers;
    const { userManager } = this.maestro.managers;

    const response = await apiHelper.get({
      path: '/activity',
      queryParams: (viewed) ? { viewed: true } : null,
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    if (viewed) {
      userManager.updateLocalUser({ lastViewedActivityAt: new Date() });
    }

    this.updateStore({ activity: response.body });

    return response.body;
  }
}
