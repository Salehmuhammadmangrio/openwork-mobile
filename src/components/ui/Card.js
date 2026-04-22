import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export const Card = ({
  children,
  style,
  onPress,
  padding = 16,
  elevated = false,
  ...props
}) => {
  const { colors } = useTheme();
  const base = [
    styles.card,
    {
      backgroundColor: colors.s1,
      borderColor: colors.cardBorder,
      padding,
    },
    elevated && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    style,
  ];
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.85 }]} {...props}>
        {children}
      </Pressable>
    );
  }
  return <View style={base} {...props}>{children}</View>;
};

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1 },
});

export default Card;
