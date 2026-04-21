import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export const Chip = ({ label, active, onPress, icon, style }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? 'rgba(108,78,246,0.18)' : colors.s2,
          borderColor: active ? colors.primary : colors.b2,
        },
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          { color: active ? colors.primary2 : colors.txt2 },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: { fontSize: 12, fontWeight: '700' },
});

export default Chip;
