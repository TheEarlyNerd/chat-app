import { Helper } from 'react-native-maestro';

export default class InterfaceHelper extends Helper {
  static get instanceKey() {
    return 'interfaceHelper';
  }

  showError = ({ message, iconComponent }) => {
    message = (typeof message === 'object') ? message.message : message;

    this.showOverlay({
      name: 'Error',
      data: { message, iconComponent },
    });
  }

  showOverlay = ({ name, data }) => {
    this.maestro.dispatchEvent('OVERLAYS:SHOW', { name, data });
  };

  hideOverlay = name => {
    this.maestro.dispatchEvent('OVERLAYS:HIDE', { name });
  }
}
