import { Dimensions, Platform } from 'react-native';
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
    let result = (notchAdjustment)
      ? (options.xs + notchAdjustment) || (options.default + notchAdjustment)
      : options.xs || options.default;

    if (width >= 411 && options.sm) {
      result = (notchAdjustment) ? (options.sm + notchAdjustment) : options.sm;
    }

    if (width >= 568 && options.md) {
      result = (notchAdjustment) ? (options.md + notchAdjustment) : options.md;
    }

    if (width >= 768 && options.lg) {
      result = (notchAdjustment) ? (options.lg + notchAdjustment) : options.lg;
    }

    if (width >= 1024 && options.xl) {
      result = (notchAdjustment) ? (options.xl + notchAdjustment) : options.xl;
    }

    if (width >= 1280 & options.xxl) {
      result = (notchAdjustment) ? (options.xxl + notchAdjustment) : options.xxl;
    }

    return result;
  }

  platformValue = options => {
    return Platform.select(options);
  }

  screenBreakpoint = () => {
    let breakpoint = 'xs';

    if (width >= 411) { breakpoint = 'sm'; }
    if (width >= 568) { breakpoint = 'md'; }
    if (width >= 768) { breakpoint = 'lg'; }
    if (width >= 1024) { breakpoint = 'xl'; }
    if (width >= 1280) { breakpoint = 'xxl'; }

    return breakpoint;
  }
}
