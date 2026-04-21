import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export const Loading = ({ text = 'Loading…', size = 'large' }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size={size} color={colors.primary} />
      {text ? <Text style={[styles.txt, { color: colors.txt2 }]}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  txt: { marginTop: 10, fontSize: 13 },
});

export default Loading;
