import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Button, Input, Textarea } from '../../components/ui';
import api from '../../utils/api';
import { formatRelative, safeArray } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const Disputes = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ orderId: '', reason: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/disputes/mine');
      setItems(safeArray(data?.disputes));
    } catch { setItems([]); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.orderId.trim() || !form.reason.trim()) return toast.error('Order ID and reason required');
    setSubmitting(true);
    try {
      await api.post('/disputes', form);
      toast.success('Dispute opened');
      setOpen(false);
      setForm({ orderId: '', reason: '', description: '' });
      await load(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen padded={false} header={
      <Header title="Disputes" onBack={() => navigation.goBack()} right={<Button title="New" size="xs" onPress={() => setOpen(true)} />} />
    }>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="warning-outline" title="No disputes" description="Hopefully you never need this." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(d) => d._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: d }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.title, { color: colors.txt }]} numberOfLines={1}>
                  {d.order?.title || 'Dispute'}
                </Text>
                <Badge variant={d.status === 'resolved' ? 'success' : d.status === 'open' ? 'warning' : 'neutral'}>
                  {(d.status || '').toUpperCase()}
                </Badge>
              </View>
              <Text style={[styles.reason, { color: colors.txt2 }]}>{d.reason}</Text>
              <Text style={[styles.meta, { color: colors.txt3 }]}>{formatRelative(d.createdAt)}</Text>
            </Card>
          )}
        />
      )}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.bg} onPress={() => setOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.s1 }]}>
          <Text style={[styles.h, { color: colors.txt }]}>Open dispute</Text>
          <Input label="Order ID" value={form.orderId} onChangeText={(v) => setForm({ ...form, orderId: v })} />
          <Input label="Reason" value={form.reason} onChangeText={(v) => setForm({ ...form, reason: v })} placeholder="e.g. Delivery not as described" />
          <Textarea label="Details" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} rows={4} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Cancel" variant="ghost" full style={{ flex: 1 }} onPress={() => setOpen(false)} />
            <Button title="Submit" full style={{ flex: 1 }} loading={submitting} onPress={submit} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 14, fontWeight: '800', flex: 1 },
  reason: { fontSize: 13, marginTop: 8 },
  meta: { fontSize: 11, marginTop: 8 },
  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  h: { fontSize: 17, fontWeight: '800', marginBottom: 14 },
});

export default Disputes;
