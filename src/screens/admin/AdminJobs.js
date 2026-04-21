import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert as RNAlert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Input, Button } from '../../components/ui';
import api from '../../utils/api';
import { safeArray, formatCurrency, formatRelative } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const AdminJobs = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState('');

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/admin/jobs', { params: q ? { search: q } : {} });
      setItems(safeArray(data?.jobs));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [q]);

  useEffect(() => { load(); }, [load]);

  const remove = (j) => {
    RNAlert.alert('Remove job?', j.title, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/jobs/${j._id}`);
            toast.success('Removed');
            load(false);
          } catch (e) {
            toast.error(e?.response?.data?.message || 'Failed');
          }
        },
      },
    ]);
  };

  return (
    <Screen padded={false} header={<Header title="Jobs" onBack={() => navigation.goBack()} />}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Input placeholder="Search jobs" value={q} onChangeText={setQ} leftIcon={<Ionicons name="search" size={18} color={colors.txt3} />} />
      </View>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="briefcase-outline" title="No jobs" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(j) => j._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: j }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.head}>
                <Text numberOfLines={2} style={[styles.title, { color: colors.txt }]}>{j.title}</Text>
                <Badge variant={j.status === 'open' ? 'success' : j.status === 'closed' ? 'danger' : 'neutral'}>
                  {(j.status || '').toUpperCase()}
                </Badge>
              </View>
              <Text style={[styles.meta, { color: colors.txt3 }]}>
                by {j.client?.fullName || '—'} · {formatRelative(j.createdAt)}
              </Text>
              <Text style={[styles.amt, { color: colors.ok }]}>
                {formatCurrency(j.budgetMin || 0)} – {formatCurrency(j.budgetMax || 0)}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button title="View" variant="ghost" size="sm" full style={{ flex: 1 }} onPress={() => navigation.navigate('JobDetail', { id: j._id })} />
                <Button title="Remove" variant="danger" size="sm" full style={{ flex: 1 }} onPress={() => remove(j)} />
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { fontSize: 14, fontWeight: '800', flex: 1, lineHeight: 19 },
  meta: { fontSize: 12, marginTop: 6 },
  amt: { fontSize: 13, fontWeight: '800', marginTop: 6 },
});

export default AdminJobs;
