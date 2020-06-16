import { Manager } from 'react-native-maestro';

const LOGGED_IN_USER_KEY = 'LOGGED_IN_USER';

let resolveInitialReadyPromise = null;

export default class UserManager extends Manager {
  static get instanceKey() {
    return 'userManager';
  }

  static initialStore = {
    user: null,
    ready: new Promise(resolve => resolveInitialReadyPromise = resolve),
  }

  constructor(maestro) {
    super(maestro);

    const { asyncStorageHelper } = this.maestro.helpers;

    this.updateStore({
      ready: asyncStorageHelper.getItem(LOGGED_IN_USER_KEY).then(user => {
        this.updateStore({ user });
        resolveInitialReadyPromise();
      }),
    });
  }

  get storeName() {
    return 'user';
  }

  async getUser(userId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({ path: `/users/${userId}` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async followUser(userId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.put({ path: `/users/${userId}/followers` });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async unfollowUser(userId) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.delete({ path: `/users/${userId}/followers` });

    if (response.code !== 204) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async requestPhoneLoginCode(phone) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.post({
      path: '/users',
      data: { phone },
    });

    if (response.code !== 204) {
      throw new Error(response.body);
    }
  }

  async login({ phone, phoneLoginCode }) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.post({
      path: '/users',
      data: { phone, phoneLoginCode },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._setLoggedInUser(response.body);
  }

  async searchUsers(search) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.get({
      path: '/users',
      queryParams: { search },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  }

  async updateUser(fields) {
    const { apiHelper, attachmentsHelper } = this.maestro.helpers;
    let avatarAttachment = null;

    if (fields.avatarUri) {
      avatarAttachment = await attachmentsHelper.uploadAttachment(fields.avatarUri);
    }

    const response = await apiHelper.patch({
      path: '/users',
      data: {
        avatarAttachmentId: (avatarAttachment) ? avatarAttachment.id : null,
        ...fields,
      },
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    this._setLoggedInUser(response.body);
  }

  nextRouteNameForUserState() {
    const { user } = this.store;

    if (!user) {
      return 'Landing';
    }

    if (!user.name || !user.username) {
      return 'SetupProfile';
    }

    // notifications

    return 'Home';
  }

  logout() {
    const { navigationHelper } = this.maestro.helpers;

    // TODO: maestro should support unlinking all screens..
    this.maestro._linkedInstances.forEach(linkedInstance => {
      const instanceName = linkedInstance.constructor.name;

      if (instanceName !== 'App' && !instanceName.includes('Manager')) {
        this.maestro.unlink(linkedInstance);
      }
    });

    this._setLoggedInUser(null);

    // TODO: maestro should support resetting all manager stores..
    Object.values(this.maestro.managers).forEach(maestroManager => {
      maestroManager.resetStore();
    });

    navigationHelper.reset('Landing');
  }

  /*
   * Helpers
   */

  _setLoggedInUser(user) {
    const { asyncStorageHelper } = this.maestro.helpers;

    user = (this.store.user && user) ? { ...this.store.user, ...user } : user;

    this.updateStore({ user });

    asyncStorageHelper.setItem(LOGGED_IN_USER_KEY, user);
  }
}
