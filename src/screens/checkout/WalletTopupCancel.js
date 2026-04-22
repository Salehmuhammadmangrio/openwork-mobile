import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Button } from '../../components/ui';

const WalletTopupCancel = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Screen header={<Header title="Payment cancelled" showBack={false} />}>
      <View style={styles.center}>
        <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,77,106,0.14)' }]}>
          <Ionicons name="close" size={56} color={colors.err} />
        </View>
        <Text style={[styles.title, { color: colors.txt }]}>Payment cancelled</Text>
        <Text style={[styles.sub, { color: colors.txt2 }]}>No charges were made. You can try again whenever you're ready.</Text>
        <View style={{ width: '100%', marginTop: 32, gap: 10 }}>
          <Button title="Try again" full onPress={() => navigation.replace('Payments')} />
          <Button title="Back to home" variant="ghost" full onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  iconWrap: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '900', marginTop: 20 },
  sub: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
});

export default WalletTopupCancel;
