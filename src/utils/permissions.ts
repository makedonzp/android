import * as Location from 'expo-location';
import { Platform } from 'react-native';
// @ts-ignore – библиотека может не иметь типов
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestAllPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const permissions = [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      ];
      const statuses = await Promise.all(permissions.map((p) => request(p)));
      return statuses.every((s) => s === RESULTS.GRANTED);
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Permission error:', error);
    return false;
  }
};