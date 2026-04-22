import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert as RNAlert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Button, Loading, EmptyState, Avatar, Alert } from '../../components/ui';
import api from '../../utils/api';
import { useAuthStore } from '../../store';
import { formatCurrency, formatRelative, safeArray } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const OrderDetail = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { id } = route.params || {};
  const user = useAuthStore((s) => s.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data?.order || data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const run = async (fn, success) => {
    setActing(true);
    try {
      await fn();
      toast.success(success);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setActing(false);
    }
  };

  if (loading) return <Screen header={<Header title="Order" onBack={() => navigation.goBack()} />}><Loading /></Screen>;
  if (!order) return <Screen header={<Header title="Order" onBack={() => navigation.goBack()} />}><EmptyState icon="alert-circle-outline" title="Order not found" /></Screen>;

  const isClient = order.client?._id === user?._id;
  const isFreelancer = order.freelancer?._id === user?._id;
  const status = order.status;

  return (
    <Screen scroll header={<Header title="Order" onBack={() => navigation.goBack()} />}>
      <Card>
        <View style={styles.rowBetween}>
          <Text style={[styles.title, { color: colors.txt }]}>{order.title}</Text>
          <Badge variant={status === 'completed' ? 'success' : status === 'cancelled' ? 'danger' : 'info'}>
            {status?.toUpperCase()}
          </Badge>
        </View>
        <Text style={[styles.meta, { color: colors.txt3 }]}>
          {formatRelative(order.createdAt)}
        </Text>
        <Text style={[styles.amount, { color: colors.ok }]}>{formatCurrency(order.totalAmount || 0)}</Text>
      </Card>

      <Card style={{ marginTop: 12, flexDirection: 'row', gap: 12 }}>
        <Avatar size={40} name={(isClient ? order.freelancer : order.client)?.fullName} src={(isClient ? order.freelancer : order.client)?.avatarUrl} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.txt3 }]}>{isClient ? 'FREELANCER' : 'CLIENT'}</Text>
          <Text style={[styles.name, { color: colors.txt }]}>{(isClient ? order.freelancer : order.client)?.fullName || '—'}</Text>
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Text style={[styles.h, { color: colors.txt }]}>Description</Text>
        <Text style={[styles.body, { color: colors.txt2 }]}>{order.description}</Text>
      </Card>

      {safeArray(order.milestones).length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>Milestones</Text>
          {order.milestones.map((m, i) => (
            <View key={i} style={styles.mRow}>
              <View style={[styles.dot, { backgroundColor: m.status === 'approved' ? colors.ok : m.status === 'pending' ? colors.warn : colors.txt3 }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.mTitle, { color: colors.txt }]}>{m.title}</Text>
                <Text style={[styles.mMeta, { color: colors.txt3 }]}>
                  {formatCurrency(m.amount || 0)} · {m.status}
                </Text>
              </View>
            </View>
          ))}
          <Button title="Manage milestones" variant="ghost" full style={{ marginTop: 10 }} onPress={() => navigation.navigate('Milestones', { orderId: id })} />
        </Card>
      )}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        {isFreelancer && (status === 'pending' || status === 'in_progress') ? (
          <Button title="Deliver work" full style={{ flex: 1 }} onPress={() => navigation.navigate('DeliverOrder', { orderId: id })} />
        ) : null}
        {isClient && status === 'delivered' ? (
          <Button title="Review delivery" full style={{ flex: 1 }} onPress={() => navigation.navigate('ReviewDeliveredOrder', { orderId: id })} />
        ) : null}
        {(isClient || isFreelancer) && status && status !== 'completed' && status !== 'cancelled' ? (
          <Button
            title="Cancel"
            variant="danger"
            full
            style={{ flex: 1 }}
            loading={acting}
            onPress={() =>
              RNAlert.alert('Cancel order?', 'This cannot be undone.', [
                { text: 'Keep order', style: 'cancel' },
                { text: 'Cancel', style: 'destructive', onPress: () => run(() => api.put(`/orders/${id}/cancel`), 'Order cancelled') },
              ])
            }
          />
        ) : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  title: { fontSize: 18, fontWeight: '800', flex: 1, lineHeight: 24 },
  meta: { fontSize: 12, marginTop: 6 },
  amount: { fontSize: 22, fontWeight: '900', marginTop: 8 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  name: { fontSize: 15, fontWeight: '800', marginTop: 3 },
  h: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
  mRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  mTitle: { fontSize: 14, fontWeight: '700' },
  mMeta: { fontSize: 11, marginTop: 2 },
});

export default OrderDetail;
