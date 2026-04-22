import React from 'react';
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

export const Button = ({
  children,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  full = false,
  onPress,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const { colors } = useTheme();
  const isGradient = variant === 'primary';

  const sizes = {
    xs: { padding: 6, paddingHorizontal: 10, fontSize: 12, radius: 8 },
    sm: { padding: 8, paddingHorizontal: 12, fontSize: 13, radius: 9 },
    md: { padding: 11, paddingHorizontal: 18, fontSize: 14, radius: 11 },
    lg: { padding: 14, paddingHorizontal: 22, fontSize: 15, radius: 13 },
    xl: { padding: 16, paddingHorizontal: 28, fontSize: 16, radius: 14 },
  }[size];

  const variantStyle = () => {
    switch (variant) {
      case 'ghost':
        return { bg: 'transparent', border: colors.b2, text: colors.txt2 };
      case 'secondary':
        return { bg: colors.s2, border: colors.b2, text: colors.txt };
      case 'danger':
        return { bg: 'rgba(255,77,106,0.14)', border: 'rgba(255,77,106,0.3)', text: colors.err };
      case 'success':
        return { bg: 'rgba(0,229,160,0.12)', border: 'rgba(0,229,160,0.25)', text: colors.ok };
      case 'warning':
        return { bg: 'rgba(255,181,46,0.12)', border: 'rgba(255,181,46,0.3)', text: colors.warn };
      case 'outline':
        return { bg: 'transparent', border: colors.primary, text: colors.primary };
      default:
        return { bg: colors.primary, border: 'transparent', text: '#fff' };
    }
  };

  const v = variantStyle();

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator size="small" color={isGradient ? '#fff' : v.text} />
      ) : (
        <>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text
            style={[
              {
                color: isGradient ? '#fff' : v.text,
                fontSize: sizes.fontSize,
                fontWeight: '700',
              },
              textStyle,
            ]}
          >
            {title ?? children}
          </Text>
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </>
      )}
    </View>
  );

  const base = {
    borderRadius: sizes.radius,
    paddingVertical: sizes.padding,
    paddingHorizontal: sizes.paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: full ? 'stretch' : 'flex-start',
    opacity: disabled ? 0.5 : 1,
  };

  if (isGradient) {
    return (
      <Pressable
        onPress={disabled || loading ? undefined : onPress}
        style={[base, { overflow: 'hidden', padding: 0 }, full && { alignSelf: 'stretch' }, style]}
      >
        <LinearGradient
          colors={['#6C4EF6', '#9B6DFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingVertical: sizes.padding,
            paddingHorizontal: sizes.paddingHorizontal,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={[
        base,
        {
          backgroundColor: v.bg,
          borderWidth: 1,
          borderColor: v.border,
        },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { marginHorizontal: 2 },
});

export default Button;
