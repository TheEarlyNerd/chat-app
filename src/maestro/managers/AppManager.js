import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Manager } from 'react-native-maestro';

export default class AppManager extends Manager {
  static get instanceKey() {
    return 'appManager';
  }

  static initialStore = {
    state: 'active',
    networkState: null,
  }

  constructor(maestro) {
    super(maestro);

    AppState.addEventListener('change', nextAppState => {
      this.updateStore({ state: nextAppState });
      this.maestro.dispatchEvent('APP_STATE_CHANGED', nextAppState);
    });

    NetInfo.addEventListener(this._updateNetworkState);

    NetInfo.fetch().then(this._updateNetworkState);
  }

  get storeName() {
    return 'appState';
  }

  /*
   * Helpers
   */

  _updateNetworkState = networkState => {
    const currentNetworkState = this.store.networkState;

    if (!!currentNetworkState && currentNetworkState.type === networkState.type && currentNetworkState.isConnected === networkState.isConnected) {
      return;
    }

    console.log(networkState);

    this.updateStore({ networkState });
    this.maestro.dispatchEvent('APP_NETWORK_STATE_CHANGED', networkState);
  }
}
