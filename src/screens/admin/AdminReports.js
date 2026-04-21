import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState } from '../../components/ui';
import api from '../../utils/api';
import { safeArray, formatRelative } from '../../utils/helpers';

const AdminReports = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/admin/reports');
      setItems(safeArray(data?.reports));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Screen padded={false} header={<Header title="Reports" onBack={() => navigation.goBack()} />}>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="document-outline" title="No reports" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(r) => r._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: r }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.head}>
                <Text numberOfLines={1} style={[styles.title, { color: colors.txt }]}>{r.subject || r.title || 'Report'}</Text>
                <Badge variant={r.status === 'resolved' ? 'success' : 'warning'}>
                  {(r.status || 'OPEN').toUpperCase()}
                </Badge>
              </View>
              <Text style={[styles.meta, { color: colors.txt3 }]}>
                by {r.reporter?.fullName || '—'} · {formatRelative(r.createdAt)}
              </Text>
              <Text style={[styles.body, { color: colors.txt2 }]}>{r.description || r.reason}</Text>
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

export default AdminReports;
