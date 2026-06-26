import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TelemetryData } from "../hooks/useTelemetry";

interface Props {
  data: TelemetryData;
}

const TelemetryPanel: React.FC<Props> = ({ data }) => {
  const networkColor = data.network ? "#2ecc71" : "#e74c3c";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 Телеметрия</Text>
      <View style={styles.row}>
        <Text style={styles.label}>GPS:</Text>
        <Text style={styles.value}>
          {data.gps
            ? `${data.gps.lat.toFixed(6)}, ${data.gps.lon.toFixed(6)}`
            : "Нет сигнала"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Высота:</Text>
        <Text style={styles.value}>
          {data.gps ? data.gps.alt.toFixed(1) : "--"} м
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Скорость:</Text>
        <Text style={styles.value}>
          {data.gps ? data.gps.speed.toFixed(1) : "--"} м/с
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Акселерометр:</Text>
        <Text style={styles.value}>
          {data.accelerometer
            ? `${data.accelerometer.x.toFixed(2)}, ${data.accelerometer.y.toFixed(2)}, ${data.accelerometer.z.toFixed(2)}`
            : "--"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Освещённость:</Text>
        <Text style={styles.value}>
          {data.light !== null ? data.light.toFixed(0) : "--"} лк
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Давление:</Text>
        <Text style={styles.value}>
          {data.barometer !== null ? data.barometer.toFixed(1) : "--"} гПа
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Батарея:</Text>
        <Text style={styles.value}>{data.battery}%</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Интернет:</Text>
        <Text style={[styles.value, { color: networkColor }]}>
          {data.network ? "✔" : "✖"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    margin: 10,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: { fontWeight: "600", color: "#333" },
  value: { color: "#555" },
});

export default TelemetryPanel;
