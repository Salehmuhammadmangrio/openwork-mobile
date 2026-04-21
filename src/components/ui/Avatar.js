import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getInitials, getAvatarGradient } from '../../utils/helpers';

export const Avatar = ({ name = '', src, size = 40, style }) => {
  const initials = getInitials(name);
  const gradient = getAvatarGradient(name);
  const rounded = size / 2;

  if (src) {
    return (
      <Image
        source={{ uri: src }}
        style={[
          { width: size, height: size, borderRadius: rounded, backgroundColor: '#222' },
          style,
        ]}
      />
    );
  }

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: rounded },
        style,
      ]}
    >
      <Text style={[styles.txt, { fontSize: size * 0.4 }]}>{initials}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  txt: { color: '#fff', fontWeight: '800' },
});

export default Avatar;
