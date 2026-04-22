import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Chip, Loading, EmptyState } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatRelative, safeArray } from '../../utils/helpers';

const STATUSES = ['all', 'pending', 'in_progress', 'delivered', 'completed', 'cancelled'];
const STATUS_LBL = { all: 'All', pending: 'Pending', in_progress: 'In progress', delivered: 'Delivered', completed: 'Completed', cancelled: 'Cancelled' };

const Orders = ({ navigation }) => {
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const params = {};
      if (status !== 'all') params.status = status;
      const { data } = await api.get('/orders', { params });
      setOrders(safeArray(data?.orders));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  return (
    <Screen header={<Header title="Orders" onBack={() => navigation.goBack()} />} padded={false}>
      <FlatList
        horizontal
        data={STATUSES}
        keyExtractor={(s) => s}
        renderItem={({ item }) => (
          <Chip label={STATUS_LBL[item]} active={status === item} onPress={() => setStatus(item)} style={{ marginRight: 8 }} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
      />
      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <EmptyState icon="bag-outline" title="No orders" description="When you create or receive orders, they'll show up here." />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o._id}
          renderItem={({ item: o }) => (
            <Card style={{ marginBottom: 10 }} onPress={() => navigation.navigate('OrderDetail', { id: o._id })}>
              <View style={styles.rowBetween}>
                <Text numberOfLines={1} style={[styles.title, { color: colors.txt }]}>{o.title}</Text>
                <Badge variant={o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'danger' : 'info'}>
                  {(o.status || '').toUpperCase()}
                </Badge>
              </View>
              <View style={styles.rowBetween}>
                <Text style={[styles.meta, { color: colors.txt3 }]}>{formatRelative(o.createdAt)}</Text>
                <Text style={[styles.amount, { color: colors.ok }]}>{formatCurrency(o.totalAmount || 0)}</Text>
              </View>
            </Card>
          )}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '800', flex: 1, paddingRight: 8 },
  meta: { fontSize: 12 },
  amount: { fontSize: 13, fontWeight: '800' },
});

export default Orders;
