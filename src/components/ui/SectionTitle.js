import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export const SectionTitle = ({ title, subtitle, actionLabel, onAction, style }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, style]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.txt }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: colors.txt3 }]}>{subtitle}</Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={[styles.action, { color: colors.primary2 }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 2 },
  action: { fontSize: 13, fontWeight: '700' },
});

export default SectionTitle;
