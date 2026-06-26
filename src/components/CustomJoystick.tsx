import React, { useRef } from "react";
import { View, StyleSheet, Dimensions, PanResponder } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const JOYSTICK_SIZE = 150;
const STICK_SIZE = 60;

interface Props {
  onMove: (data: {
    x: number;
    y: number;
    angle: number;
    distance: number;
  }) => void;
}

const CustomJoystick: React.FC<Props> = ({ onMove }) => {
  const position = useSharedValue({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      isDragging.current = true;
    },
    onPanResponderMove: (evt, gestureState) => {
      // ограничиваем движение внутри круга
      const maxRadius = (JOYSTICK_SIZE - STICK_SIZE) / 2;
      let dx = gestureState.dx;
      let dy = gestureState.dy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > maxRadius) {
        dx = (dx / distance) * maxRadius;
        dy = (dy / distance) * maxRadius;
      }
      position.value = { x: dx, y: dy };

      // вызываем колбэк с нормализованными значениями (-1..1)
      const normalizedX = dx / maxRadius;
      const normalizedY = dy / maxRadius;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      onMove({
        x: normalizedX,
        y: normalizedY,
        angle,
        distance: Math.sqrt(
          normalizedX * normalizedX + normalizedY * normalizedY,
        ),
      });
    },
    onPanResponderRelease: () => {
      isDragging.current = false;
      position.value = { x: 0, y: 0 };
      onMove({
        x: 0,
        y: 0,
        angle: 0,
        distance: 0,
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value.x },
      { translateY: position.value.y },
    ],
  }));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.joystickBase,
          {
            width: JOYSTICK_SIZE,
            height: JOYSTICK_SIZE,
            borderRadius: JOYSTICK_SIZE / 2,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.stick,
            {
              width: STICK_SIZE,
              height: STICK_SIZE,
              borderRadius: STICK_SIZE / 2,
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  joystickBase: {
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
