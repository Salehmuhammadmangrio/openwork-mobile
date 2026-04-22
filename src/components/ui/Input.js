import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export const Input = ({
  label,
  error,
  hint,
  secureTextEntry,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  ...props
}) => {
  const { colors } = useTheme();
  const [focus, setFocus] = useState(false);
  const [hide, setHide] = useState(!!secureTextEntry);

  return (
    <View style={[styles.group, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: colors.txt2 }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.wrap,
          {
            backgroundColor: colors.s2,
            borderColor: error
              ? colors.err
              : focus
              ? colors.primary
              : colors.b2,
          },
        ]}
      >
        {leftIcon ? <View style={styles.iconL}>{leftIcon}</View> : null}
        <TextInput
          {...props}
          secureTextEntry={secureTextEntry && hide}
          onFocus={(e) => {
            setFocus(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors.txt3}
          style={[
            styles.input,
            { color: colors.txt, flex: 1 },
            inputStyle,
          ]}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHide((v) => !v)} style={styles.iconR}>
            <Ionicons
              name={hide ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.txt3}
            />
          </Pressable>
        ) : rightIcon ? (
          <View style={styles.iconR}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? (
        <Text style={[styles.hint, { color: colors.err }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.hint, { color: colors.txt3 }]}>{hint}</Text>
      ) : null}
    </View>
  );
};

export const Textarea = ({ rows = 4, ...props }) => (
  <Input
    {...props}
    multiline
    numberOfLines={rows}
    inputStyle={[{ minHeight: rows * 20, textAlignVertical: 'top' }, props.inputStyle]}
  />
);

const styles = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6, letterSpacing: 0.3 },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  input: { paddingVertical: 10, fontSize: 15 },
  iconL: { marginRight: 8 },
  iconR: { marginLeft: 8, padding: 4 },
  hint: { fontSize: 12, marginTop: 5 },
});

export default Input;
