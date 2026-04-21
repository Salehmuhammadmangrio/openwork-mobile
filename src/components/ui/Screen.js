import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export const Screen = ({
  children,
  scroll = false,
  style,
  contentStyle,
  padded = true,
  refreshing,
  onRefresh,
  keyboardAware = false,
  edges = ['bottom'],
  header = null,
}) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const pad = edges.includes('bottom') ? insets.bottom : 0;

  const Content = scroll ? ScrollView : View;
  const contentProps = scroll
    ? {
        contentContainerStyle: [
          padded && styles.padded,
          { paddingBottom: pad + (padded ? 24 : 0) },
          contentStyle,
        ],
        showsVerticalScrollIndicator: false,
        refreshControl:
          onRefresh != null ? (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          ) : undefined,
        keyboardShouldPersistTaps: 'handled',
      }
    : { style: [styles.flex, padded && styles.padded, { paddingBottom: pad }, contentStyle] };

  const body = (
    <View style={[styles.flex, { backgroundColor: colors.bg }, style]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      {header}
      <Content {...contentProps} style={scroll ? [styles.flex] : contentProps.style}>
        {scroll ? children : children}
      </Content>
    </View>
  );

  if (keyboardAware) {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    );
  }
  return body;
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  padded: { paddingHorizontal: 16, paddingTop: 8 },
});

export default Screen;
