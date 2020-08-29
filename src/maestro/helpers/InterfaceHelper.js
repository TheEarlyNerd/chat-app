import { Dimensions } from 'react-native';
import { Helper } from 'react-native-maestro';
import DeviceInfo from 'react-native-device-info';

const { width } = Dimensions.get('window');

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

  deviceValue = options => {
    const notchAdjustment = (DeviceInfo.hasNotch() && options.notchAdjustment) ? options.notchAdjustment : 0;

    if (width >= 1280) {
      return (options.xxl + notchAdjustment) || (options.default + notchAdjustment);
    }

    if (width >= 1024) {
      return (options.xl + notchAdjustment) || (options.default + notchAdjustment);
    }

    if (width >= 768) {
      return (options.lg + notchAdjustment) || (options.default + notchAdjustment);
    }

    if (width >= 568) {
      return (options.md + notchAdjustment) || (options.default + notchAdjustment);
    }

    if (width >= 411) {
      return (options.sm + notchAdjustment) || (options.default + notchAdjustment);
    }

    if (width <= 410) {
      return (options.xs + notchAdjustment) || (options.default + notchAdjustment);
    }
  }
}
