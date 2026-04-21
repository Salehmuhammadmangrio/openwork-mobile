import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input, Loading, EmptyState, Badge } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, safeArray } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const Milestones = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data?.order || data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [orderId]);

  const add = async () => {
    if (!newTitle.trim() || !newAmount) return toast.error('Title and amount required');
    setCreating(true);
    try {
      await api.post(`/orders/${orderId}/milestones`, { title: newTitle, amount: parseFloat(newAmount) });
      setNewTitle('');
      setNewAmount('');
      toast.success('Milestone added');
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const approve = async (mid) => {
    try {
      await api.put(`/orders/${orderId}/milestones/${mid}/approve`);
      toast.success('Milestone approved');
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <Screen header={<Header title="Milestones" onBack={() => navigation.goBack()} />}><Loading /></Screen>;
  if (!order) return <Screen header={<Header title="Milestones" onBack={() => navigation.goBack()} />}><EmptyState icon="alert-circle-outline" title="Order not found" /></Screen>;

  const ms = safeArray(order.milestones);

  return (
    <Screen scroll keyboardAware header={<Header title="Milestones" onBack={() => navigation.goBack()} />}>
      {ms.length === 0 ? (
        <EmptyState icon="flag-outline" title="No milestones yet" description="Break down the project into trackable milestones." />
      ) : (
        ms.map((m, i) => (
          <Card key={m._id || i} style={{ marginBottom: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={[styles.title, { color: colors.txt }]}>{m.title}</Text>
              <Badge variant={m.status === 'approved' ? 'success' : m.status === 'pending' ? 'info' : 'neutral'}>
                {(m.status || 'draft').toUpperCase()}
              </Badge>
            </View>
            <Text style={[styles.amount, { color: colors.ok }]}>{formatCurrency(m.amount || 0)}</Text>
            {m.status === 'pending' ? (
              <Button title="Approve & release" variant="ghost" size="sm" style={{ marginTop: 8 }} onPress={() => approve(m._id)} />
            ) : null}
          </Card>
        ))
      )}

      <Card style={{ marginTop: 10 }}>
        <Text style={[styles.h, { color: colors.txt }]}>Add milestone</Text>
        <Input label="Title" value={newTitle} onChangeText={setNewTitle} placeholder="e.g. Wireframes delivered" />
        <Input label="Amount ($)" value={newAmount} onChangeText={setNewAmount} keyboardType="decimal-pad" />
        <Button title="Add milestone" full loading={creating} onPress={add} />
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 15, fontWeight: '800', flex: 1, paddingRight: 8 },
  amount: { fontSize: 14, fontWeight: '800', marginTop: 6 },
  h: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
});

export default Milestones;
