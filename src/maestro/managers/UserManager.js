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

    this.updateStore({ user: response.body });
  }

  logout() {
    this.updateStore({ user: null });
    this.resetStore();
  }
}
