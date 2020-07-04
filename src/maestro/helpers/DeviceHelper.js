import { Platform } from 'react-native';
import { Helper } from 'react-native-maestro';
import DeviceInfo from 'react-native-device-info';

export default class DevicerHelper extends Helper {
  static get instanceKey() {
    return 'deviceHelper';
  }

  getIDFV() {
    return DeviceInfo.getUniqueId();
  }

  async isEmulator() {
    return DeviceInfo.isEmulator();
  }

  async getDeviceDetails() {
    return {
      os: Platform.OS,
      locationProviders: await DeviceInfo.getAvailableLocationProviders(),
      buildId: await DeviceInfo.getBuildId(),
      batteryLevel: await DeviceInfo.getBatteryLevel(),
      brand: DeviceInfo.getBrand(),
      buildNumber: DeviceInfo.getBuildNumber(),
      bundleId: DeviceInfo.getBundleId(),
      carrier: await DeviceInfo.getCarrier(),
      deviceId: DeviceInfo.getDeviceId(),
      deviceType: DeviceInfo.getDeviceType(),
      deviceName: await DeviceInfo.getDeviceName(),
      fontScale: await DeviceInfo.getFontScale(),
      freeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
      ipAddress: await DeviceInfo.getIpAddress(),
      macAddress: await DeviceInfo.getMacAddress(),
      manufacturer: await DeviceInfo.getManufacturer(),
      model: DeviceInfo.getModel(),
      powerState: await DeviceInfo.getPowerState(),
      readableVersion: DeviceInfo.getReadableVersion(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      totalDiskCapacity: await DeviceInfo.getTotalDiskCapacity(),
      totalMemory: await DeviceInfo.getTotalMemory(),
      uniqueId: DeviceInfo.getUniqueId(),
      usedMemory: await DeviceInfo.getUsedMemory(),
      userAgent: await DeviceInfo.getUserAgent(),
      version: DeviceInfo.getVersion(),
      hasNotch: DeviceInfo.hasNotch(),
      isBatteryCharging: await DeviceInfo.isBatteryCharging(),
      isEmulator: await DeviceInfo.isEmulator(),
      isHeadphonesConnected: await DeviceInfo.isHeadphonesConnected(),
      isTablet: DeviceInfo.isTablet(),
    };
  }
}
