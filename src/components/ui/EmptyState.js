import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import Button from './Button';

export const EmptyState = ({
  icon = 'sparkles-outline',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.s2 }]}>
        <Ionicons name={icon} size={36} color={colors.primary2} />
      </View>
      <Text style={[styles.title, { color: colors.txt }]}>{title}</Text>
      {description ? (
        <Text style={[styles.desc, { color: colors.txt2 }]}>{description}</Text>
      ) : null}
      {actionLabel ? (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: 16 }} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  iconWrap: {
    width: 76, height: 76, borderRadius: 38,
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  title: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  desc: { fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 },
});

export default EmptyState;
