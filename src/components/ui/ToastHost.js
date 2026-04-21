import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { registerToastHandler } from '../../utils/toast';
import { useTheme } from '../../theme';

const ICONS = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  warn: 'warning',
  info: 'information-circle',
};

export const ToastHost = () => {
  const [queue, setQueue] = useState([]);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    registerToastHandler((t) => {
      setQueue((q) => [...q, t]);
      setTimeout(() => {
        setQueue((q) => q.filter((x) => x.id !== t.id));
      }, t.duration || 2600);
    });
  }, []);

  if (queue.length === 0) return null;
  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { top: insets.top + 10 }]}
    >
      {queue.slice(-3).map((t) => (
        <ToastItem key={t.id} toast={t} colors={colors} onClose={() => setQueue((q) => q.filter((x) => x.id !== t.id))} />
      ))}
    </View>
  );
};

const ToastItem = ({ toast, colors, onClose }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  }, []);

  const colorMap = {
    success: colors.ok,
    error: colors.err,
    warn: colors.warn,
    info: colors.info,
  };
  const fg = colorMap[toast.type] || colors.info;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: colors.s1,
          borderColor: fg,
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-18, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Ionicons name={ICONS[toast.type] || 'information-circle'} size={20} color={fg} />
      <Text numberOfLines={3} style={[styles.text, { color: colors.txt }]}>
        {toast.message}
      </Text>
      <Pressable onPress={onClose} hitSlop={10}>
        <Ionicons name="close" size={16} color={colors.txt3} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 12,
    right: 12,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    width: '100%',
    maxWidth: 480,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  text: { flex: 1, fontSize: 13, fontWeight: '600' },
});

export default ToastHost;
