import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert as RNAlert } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Button } from '../../components/ui';
import api from '../../utils/api';
import { safeArray, formatRelative } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const AdminDisputes = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/admin/disputes');
      setItems(safeArray(data?.disputes));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resolve = (d, favor) => {
    RNAlert.alert(`Resolve in favor of ${favor}?`, '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Resolve',
        onPress: async () => {
          try {
            await api.put(`/admin/disputes/${d._id}/resolve`, { favor });
            toast.success('Resolved');
            load(false);
          } catch (e) {
            toast.error(e?.response?.data?.message || 'Failed');
          }
        },
      },
    ]);
  };

  return (
    <Screen padded={false} header={<Header title="Disputes" onBack={() => navigation.goBack()} />}>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="warning-outline" title="No open disputes" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(d) => d._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: d }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.head}>
                <Text numberOfLines={1} style={[styles.title, { color: colors.txt }]}>
                  {d.order?.title || 'Dispute'}
                </Text>
                <Badge variant={d.status === 'resolved' ? 'success' : d.status === 'open' ? 'warning' : 'neutral'}>
                  {(d.status || '').toUpperCase()}
                </Badge>
              </View>
              <Text style={[styles.meta, { color: colors.txt3 }]}>
                {d.raisedBy?.fullName || 'User'} · {formatRelative(d.createdAt)}
              </Text>
              <Text style={[styles.body, { color: colors.txt2 }]}>{d.reason}</Text>
              {d.status === 'open' ? (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <Button title="Favor client" variant="ghost" size="sm" full style={{ flex: 1 }} onPress={() => resolve(d, 'client')} />
                  <Button title="Favor freelancer" variant="ghost" size="sm" full style={{ flex: 1 }} onPress={() => resolve(d, 'freelancer')} />
                </View>
              ) : null}
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 14, fontWeight: '800', flex: 1 },
  meta: { fontSize: 11, marginTop: 4 },
  body: { fontSize: 13, lineHeight: 19, marginTop: 8 },
});

export default AdminDisputes;
