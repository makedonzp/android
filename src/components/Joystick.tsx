import React, { useRef } from "react";
import { View, StyleSheet, Animated, PanResponder } from "react-native";

interface Props {
  onMove: (data: {
    x: number;
    y: number;
    angle: number;
    distance: number;
  }) => void;
  size?: number;
}

const CustomJoystick: React.FC<Props> = ({ onMove, size = 150 }) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const radius = size / 2 - 20;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let dx = gesture.dx;
        let dy = gesture.dy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > radius) {
          dx = (dx / distance) * radius;
          dy = (dy / distance) * radius;
        }
        pan.setValue({ x: dx, y: dy });
        // Нормализуем значения от -1 до 1
        const xNorm = dx / radius;
        const yNorm = dy / radius;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        onMove({ x: xNorm, y: yNorm, angle, distance: distance / radius });
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        onMove({ x: 0, y: 0, angle: 0, distance: 0 });
      },
    }),
  ).current;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Animated.View
        style={[
          styles.stick,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size * 0.2,
          },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  stick: {
    backgroundColor: "#2ecc71",
    position: "absolute",
  },
});

export default CustomJoystick;
