import { AppState } from 'react-native';
import { Manager } from 'react-native-maestro';

export default class AppStateManager extends Manager {
  static get instanceKey() {
    return 'appStateManager';
  }

  static initialStore = {
    state: 'active',
  }

  constructor(maestro) {
    super(maestro);

    AppState.addEventListener('change', nextAppState => {
      this.updateStore({ state: nextAppState });
      this.maestro.dispatchEvent('APP_STATE_CHANGED', nextAppState);
    });
  }

  get storeName() {
    return 'appState';
  }
}
