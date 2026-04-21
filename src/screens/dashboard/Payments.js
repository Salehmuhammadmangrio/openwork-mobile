import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input, Loading, EmptyState, Badge, SectionTitle, Alert } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatRelative, safeArray } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const Payments = ({ navigation }) => {
  const { colors } = useTheme();
  const [wallet, setWallet] = useState({ balance: 0, pending: 0 });
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topup, setTopup] = useState('');
  const [withdraw, setWithdraw] = useState('');
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const [w, t] = await Promise.all([
        api.get('/payments/wallet').catch(() => ({ data: {} })),
        api.get('/payments/transactions').catch(() => ({ data: {} })),
      ]);
      setWallet({ balance: w.data?.balance || 0, pending: w.data?.pending || 0 });
      setTxns(safeArray(t.data?.transactions));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startTopup = async () => {
    const amt = parseFloat(topup);
    if (!amt || amt < 1) return toast.error('Enter a valid amount');
    setBusy(true);
    try {
      const { data } = await api.post('/payments/topup', { amount: amt });
      if (data?.checkoutUrl) navigation.navigate('Checkout', { url: data.checkoutUrl, amount: amt });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const requestWithdraw = async () => {
    const amt = parseFloat(withdraw);
    if (!amt || amt < 1) return toast.error('Enter a valid amount');
    if (amt > wallet.balance) return toast.error('Amount exceeds balance');
    setBusy(true);
    try {
      await api.post('/payments/withdraw', { amount: amt });
      toast.success('Withdrawal requested');
      setWithdraw('');
      await load(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Screen header={<Header title="Payments" onBack={() => navigation.goBack()} />}><Loading /></Screen>;

  return (
    <Screen scroll keyboardAware header={<Header title="Payments" onBack={() => navigation.goBack()} />}>
      <LinearGradient colors={['#6C4EF6', '#9B6DFF']} style={styles.wallet}>
        <Text style={styles.label}>AVAILABLE BALANCE</Text>
        <Text style={styles.balance}>{formatCurrency(wallet.balance)}</Text>
        <Text style={styles.pending}>Pending: {formatCurrency(wallet.pending)}</Text>
      </LinearGradient>

      <SectionTitle title="Add funds" />
      <Card>
        <Input label="Amount ($)" value={topup} onChangeText={setTopup} keyboardType="decimal-pad" placeholder="50" />
        <Button title="Top up with card" full size="lg" loading={busy} onPress={startTopup} leftIcon={<Ionicons name="card" size={18} color="#fff" />} />
      </Card>

      <SectionTitle title="Withdraw" />
      <Card>
        <Input label="Amount ($)" value={withdraw} onChangeText={setWithdraw} keyboardType="decimal-pad" placeholder="25" />
        <Button title="Request withdrawal" variant="secondary" full loading={busy} onPress={requestWithdraw} />
      </Card>

      <SectionTitle title="Transactions" />
      {txns.length === 0 ? (
        <EmptyState icon="receipt-outline" title="No transactions yet" />
      ) : (
        txns.slice(0, 30).map((t) => (
          <Card key={t._id} style={{ marginBottom: 8 }}>
            <View style={styles.txRow}>
              <View style={[styles.dot, { backgroundColor: t.type === 'credit' ? colors.ok : colors.err }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.txTitle, { color: colors.txt }]}>{t.description || (t.type === 'credit' ? 'Credit' : 'Debit')}</Text>
                <Text style={[styles.txMeta, { color: colors.txt3 }]}>{formatRelative(t.createdAt)}</Text>
              </View>
              <Text style={[styles.txAmt, { color: t.type === 'credit' ? colors.ok : colors.err }]}>
                {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount || 0)}
              </Text>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  wallet: { padding: 22, borderRadius: 18, marginBottom: 6 },
  label: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  balance: { color: '#fff', fontSize: 34, fontWeight: '900', marginTop: 6 },
  pending: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  txTitle: { fontSize: 13, fontWeight: '700' },
  txMeta: { fontSize: 11, marginTop: 2 },
  txAmt: { fontSize: 14, fontWeight: '800' },
});

export default Payments;
