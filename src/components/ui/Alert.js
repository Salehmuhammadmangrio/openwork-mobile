import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

const iconMap = {
  info: 'information-circle-outline',
  success: 'checkmark-circle-outline',
  warning: 'warning-outline',
  error: 'alert-circle-outline',
};

export const Alert = ({ variant = 'info', title, children, style }) => {
  const { colors } = useTheme();
  const map = {
    info: { bg: 'rgba(79,179,255,0.10)', border: 'rgba(79,179,255,0.35)', fg: colors.info },
    success: { bg: 'rgba(0,229,160,0.10)', border: 'rgba(0,229,160,0.35)', fg: colors.ok },
    warning: { bg: 'rgba(255,181,46,0.10)', border: 'rgba(255,181,46,0.35)', fg: colors.warn },
    error: { bg: 'rgba(255,77,106,0.10)', border: 'rgba(255,77,106,0.35)', fg: colors.err },
  };
  const v = map[variant];
  return (
    <View style={[styles.wrap, { backgroundColor: v.bg, borderColor: v.border }, style]}>
      <Ionicons name={iconMap[variant]} size={18} color={v.fg} style={{ marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        {title ? <Text style={[styles.title, { color: v.fg }]}>{title}</Text> : null}
        {typeof children === 'string' ? (
          <Text style={[styles.body, { color: colors.txt }]}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  title: { fontWeight: '800', fontSize: 13, marginBottom: 2 },
  body: { fontSize: 13, lineHeight: 19 },
});

export default Alert;
