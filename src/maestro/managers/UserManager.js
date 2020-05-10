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
        console.log(user);
        this.updateStore({ user });
        resolveInitialReadyPromise();
      }),
    });
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

  async updateUser(fields) {
    const { apiHelper, attachmentsHelper } = this.maestro.helpers;
    let avatarAttachment = null;

    if (fields.avatarUri) {
      avatarAttachment = await attachmentsHelper.uploadAttachment({
        uri: fields.avatarUri,
        name: 'file',
      });
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
    this._setLoggedInUser(null);
    this.resetStore();
  }

  /*
   * Helpers
   */

  _setLoggedInUser(user) {
    const { asyncStorageHelper } = this.maestro.helpers;

    user = (this.store.user) ? { ...this.store.user, ...user } : user;

    this.updateStore({ user });

    asyncStorageHelper.setItem(LOGGED_IN_USER_KEY, user);
  }
}
