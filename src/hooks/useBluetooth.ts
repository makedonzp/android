import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Интерфейс для устройств
interface Device {
  id: string;
  name: string;
}

export const useBluetooth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Если платформа Web – ничего не делаем
    if (Platform.OS === 'web') {
      console.warn('Bluetooth не поддерживается на Web');
      return;
    }

    // Динамический импорт библиотеки (только на нативных платформах)
    const BluetoothSerial = require('react-native-bluetooth-serial');

    BluetoothSerial.init();
    BluetoothSerial.list().then((list: any[]) => {
      setDevices(list.map((d: any) => ({ id: d.id, name: d.name || 'Unknown' })));
    });
  }, []);

  const connect = async (mac: string) => {
    if (Platform.OS === 'web') {
      console.warn('Bluetooth не поддерживается на Web');
      return;
    }
    try {
      const BluetoothSerial = require('react-native-bluetooth-serial');
      await BluetoothSerial.connect(mac);
      setIsConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnected(false);
    }
  };

  const disconnect = async () => {
    if (Platform.OS === 'web') {
      console.warn('Bluetooth не поддерживается на Web');
      return;
    }
    try {
      const BluetoothSerial = require('react-native-bluetooth-serial');
      await BluetoothSerial.disconnect();
      setIsConnected(false);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const sendCommand = async (command: string) => {
    if (!isConnected) {
      console.warn('Not connected');
      return;
    }
    if (Platform.OS === 'web') {
      console.warn('Bluetooth не поддерживается на Web');
      return;
    }
    try {
      const BluetoothSerial = require('react-native-bluetooth-serial');
      await BluetoothSerial.write(command + '\n');
    } catch (error) {
      console.error('Send failed:', error);
    }
  };

  return { isConnected, devices, connect, disconnect, sendCommand };
};