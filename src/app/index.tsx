import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useTelemetry } from "../hooks/useTelemetry";
import { useBluetooth } from "../hooks/useBluetooth";
import TelemetryPanel from "../components/TelemetryPanel";
import CustomJoystick from "../components/Joystick";

export default function Index() {
  const telemetry = useTelemetry();
  // Используем хук только если не Web
  const bluetooth = useBluetooth();
  const { isConnected, devices, connect, disconnect, sendCommand } = bluetooth;
  const [nightMode, setNightMode] = useState(false);

  // Ночной режим
  useEffect(() => {
    if (telemetry.light !== null && telemetry.light < 20) {
      setNightMode(true);
    } else {
      setNightMode(false);
    }
  }, [telemetry.light]);

  const handleMove = (data: {
    x: number;
    y: number;
    angle: number;
    distance: number;
  }) => {
    const throttle = Math.round((data.y + 1) * 50);
    const roll = Math.round(data.x * 45);
    const command = `T${throttle},R${roll}`;
    sendCommand(command);
    console.log("Отправлено:", command);
  };

  const statusColor = isConnected ? "#2ecc71" : "#e74c3c";

  return (
    <SafeAreaView
      style={[styles.container, nightMode && styles.nightContainer]}
    >
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, nightMode && styles.nightText]}>
            Drone Controller
          </Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {isConnected ? "🔗 Подключено" : "❌ Не подключено"}
          </Text>
        </View>

        {devices.length > 0 && (
          <View style={styles.buttonRow}>
            <Button
              title={
                isConnected
                  ? "Отключиться"
                  : `Подключиться к ${devices[0].name}`
              }
              onPress={() => {
                if (isConnected) {
                  disconnect();
                } else {
                  connect(devices[0].id);
                }
              }}
            />
          </View>
        )}

        <TelemetryPanel data={telemetry} />

        <View style={styles.joystickArea}>
          <Text style={[styles.label, nightMode && styles.nightText]}>
            Управление:
          </Text>
          <CustomJoystick onMove={handleMove} />
        </View>

        <View style={styles.modeIndicator}>
          <Text style={[styles.label, nightMode && styles.nightText]}>
            Режим: {nightMode ? "🌙 Ночной" : "☀️ Дневной"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  nightContainer: { backgroundColor: "#1a1a2e" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold" },
  nightText: { color: "#fff" },
  status: { fontWeight: "600" },
  buttonRow: { paddingHorizontal: 20, marginBottom: 10 },
  joystickArea: { alignItems: "center", marginVertical: 10 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  modeIndicator: { alignItems: "center", marginVertical: 10 },
});
