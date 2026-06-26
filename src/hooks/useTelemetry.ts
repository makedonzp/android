import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Accelerometer, Gyroscope, LightSensor, Barometer } from 'expo-sensors';
import * as Battery from 'expo-battery';
// @ts-ignore – типы могут отсутствовать
import NetInfo from '@react-native-community/netinfo';

export interface TelemetryData {
  gps: { lat: number; lon: number; alt: number; speed: number } | null;
  accelerometer: { x: number; y: number; z: number } | null;
  gyroscope: { x: number; y: number; z: number } | null;
  light: number | null;
  barometer: number | null;
  battery: number;
  network: boolean;
}

export const useTelemetry = () => {
  const [data, setData] = useState<TelemetryData>({
    gps: null,
    accelerometer: null,
    gyroscope: null,
    light: null,
    barometer: null,
    battery: 0,
    network: false,
  });

  // GPS
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 1 },
        (pos) => {
          setData((prev) => ({
            ...prev,
            gps: {
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
              alt: pos.coords.altitude || 0,
              speed: pos.coords.speed || 0,
            },
          }));
        }
      );
    })();
    return () => subscription?.remove();
  }, []);

  // Акселерометр
  useEffect(() => {
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      setData((prev) => ({ ...prev, accelerometer: { x, y, z } }));
    });
    Accelerometer.setUpdateInterval(100);
    return () => sub.remove();
  }, []);

  // Гироскоп
  useEffect(() => {
    const sub = Gyroscope.addListener(({ x, y, z }) => {
      setData((prev) => ({ ...prev, gyroscope: { x, y, z } }));
    });
    Gyroscope.setUpdateInterval(100);
    return () => sub.remove();
  }, []);

  // Освещённость
  useEffect(() => {
    const sub = LightSensor.addListener(({ illuminance }) => {
      setData((prev) => ({ ...prev, light: illuminance }));
    });
    LightSensor.setUpdateInterval(100);
    return () => sub.remove();
  }, []);

  // Барометр (если есть)
  useEffect(() => {
    let sub: any = null;
    try {
      sub = Barometer.addListener(({ pressure }) => {
        setData((prev) => ({ ...prev, barometer: pressure }));
      });
    } catch {
      console.warn('Barometer not available');
    }
    return () => sub?.remove?.();
  }, []);

  // Батарея
  useEffect(() => {
    const updateBattery = async () => {
      const level = await Battery.getBatteryLevelAsync();
      setData((prev) => ({ ...prev, battery: Math.round(level * 100) }));
    };
    updateBattery();
    const interval = setInterval(updateBattery, 30000);
    return () => clearInterval(interval);
  }, []);

  // Интернет
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setData((prev) => ({ ...prev, network: state.isConnected || false }));
    });
    return () => unsubscribe();
  }, []);

  return data;
};