import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export const Header = ({
  title,
  subtitle,
  onBack,
  right,
  showBack = true,
  transparent = false,
}) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + (Platform.OS === 'android' ? 4 : 0),
          backgroundColor: transparent ? 'transparent' : colors.bg,
          borderBottomColor: transparent ? 'transparent' : colors.b1,
        },
      ]}
    >
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={26} color={colors.txt} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
        <View style={styles.center}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.txt }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={[styles.subtitle, { color: colors.txt3 }]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.iconBtn}>{right}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    minHeight: 52,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', paddingHorizontal: 6 },
  title: { fontSize: 17, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
});

export default Header;
