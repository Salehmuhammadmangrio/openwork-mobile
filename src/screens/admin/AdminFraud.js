import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert as RNAlert } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Button } from '../../components/ui';
import api from '../../utils/api';
import { safeArray, formatRelative } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const AdminFraud = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/admin/fraud');
      setItems(safeArray(data?.flags));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const dismiss = (f) => {
    RNAlert.alert('Dismiss flag?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Dismiss',
        onPress: async () => {
          try {
            await api.put(`/admin/fraud/${f._id}/dismiss`);
            toast.success('Dismissed');
            load(false);
          } catch (e) { toast.error(e?.response?.data?.message || 'Failed'); }
        },
      },
    ]);
  };

  const ban = (f) => {
    RNAlert.alert('Suspend user?', f.user?.email || '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Suspend',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.put(`/admin/users/${f.user?._id}/suspend`);
            toast.success('Suspended');
            load(false);
          } catch (e) { toast.error(e?.response?.data?.message || 'Failed'); }
        },
      },
    ]);
  };

  return (
    <Screen padded={false} header={<Header title="Fraud" onBack={() => navigation.goBack()} />}>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="shield-checkmark-outline" title="All clear" description="No fraud flags right now." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(f) => f._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: f }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.head}>
                <Text style={[styles.title, { color: colors.txt }]}>{f.user?.fullName || '—'}</Text>
                <Badge variant={f.severity === 'high' ? 'danger' : f.severity === 'medium' ? 'warning' : 'info'}>
                  {(f.severity || 'LOW').toUpperCase()}
                </Badge>
              </View>
              <Text style={[styles.meta, { color: colors.txt3 }]}>
                {f.user?.email} · {formatRelative(f.createdAt)}
              </Text>
              <Text style={[styles.body, { color: colors.txt2 }]}>{f.reason}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button title="Dismiss" variant="ghost" size="sm" full style={{ flex: 1 }} onPress={() => dismiss(f)} />
                <Button title="Suspend user" variant="danger" size="sm" full style={{ flex: 1 }} onPress={() => ban(f)} />
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 14, fontWeight: '800', flex: 1, paddingRight: 8 },
  meta: { fontSize: 11, marginTop: 4 },
  body: { fontSize: 13, lineHeight: 19, marginTop: 8 },
});

export default AdminFraud;
