import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export const Badge = ({ children, variant = 'info', style, textStyle }) => {
  const { colors } = useTheme();
  const map = {
    info: { bg: 'rgba(79,179,255,0.15)', fg: colors.info },
    success: { bg: 'rgba(0,229,160,0.14)', fg: colors.ok },
    warning: { bg: 'rgba(255,181,46,0.14)', fg: colors.warn },
    danger: { bg: 'rgba(255,77,106,0.14)', fg: colors.err },
    neutral: { bg: colors.s2, fg: colors.txt2 },
    primary: { bg: 'rgba(108,78,246,0.18)', fg: colors.primary2 },
  };
  const v = map[variant] || map.info;
  return (
    <View style={[styles.badge, { backgroundColor: v.bg }, style]}>
      <Text style={[styles.txt, { color: v.fg }, textStyle]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  txt: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
});

export default Badge;
