import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';

export const Divider = ({ style, vertical = false }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        vertical
          ? { width: 1, alignSelf: 'stretch' }
          : { height: 1, alignSelf: 'stretch' },
        { backgroundColor: colors.b1 },
        style,
      ]}
    />
  );
};

export default Divider;
