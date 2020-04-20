import { Helper } from 'react-native-maestro';

export default class InterfaceHelper extends Helper {
  static get instanceKey() {
    return 'interfaceHelper';
  }

  showError = ({ message, iconComponent }) => {
    message = (typeof message === 'object') ? message.message : message;

    this.maestro.dispatchEvent('OVERLAYS:SHOW', {
      name: 'Error',
      data: { message, iconComponent },
    });
  }
}
