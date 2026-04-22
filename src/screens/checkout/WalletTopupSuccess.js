import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Screen, Header, Button } from '../../components/ui';
import { formatCurrency } from '../../utils/helpers';

const WalletTopupSuccess = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { amount } = route.params || {};
  return (
    <Screen header={<Header title="Payment success" showBack={false} />} padded>
      <View style={styles.center}>
        <LinearGradient colors={['#00E5A0', '#4FD1C5']} style={styles.iconWrap}>
          <Ionicons name="checkmark" size={56} color="#fff" />
        </LinearGradient>
        <Text style={[styles.title, { color: colors.txt }]}>Payment successful</Text>
        {amount ? <Text style={[styles.amt, { color: colors.primary2 }]}>{formatCurrency(amount)}</Text> : null}
        <Text style={[styles.sub, { color: colors.txt2 }]}>Funds have been added to your wallet.</Text>
        <View style={{ width: '100%', marginTop: 32, gap: 10 }}>
          <Button title="Go to Payments" full onPress={() => navigation.replace('Payments')} />
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
  amt: { fontSize: 28, fontWeight: '900', marginTop: 8 },
  sub: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
});

export default WalletTopupSuccess;
