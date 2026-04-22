import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState } from '../../components/ui';
import api from '../../utils/api';
import { safeArray, formatRelative } from '../../utils/helpers';

const AdminLogs = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/admin/logs');
      setItems(safeArray(data?.logs));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const levelColor = (lvl) => {
    if (lvl === 'error') return 'danger';
    if (lvl === 'warn') return 'warning';
    if (lvl === 'info') return 'info';
    return 'neutral';
  };

  return (
    <Screen padded={false} header={<Header title="System logs" onBack={() => navigation.goBack()} />}>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="terminal-outline" title="No logs" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(l) => l._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: l }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.head}>
                <Badge variant={levelColor(l.level)}>{(l.level || 'INFO').toUpperCase()}</Badge>
                <Text style={[styles.time, { color: colors.txt3 }]}>{formatRelative(l.createdAt)}</Text>
              </View>
              <Text style={[styles.msg, { color: colors.txt }]}>{l.message}</Text>
              {l.meta ? (
                <Text numberOfLines={3} style={[styles.meta, { color: colors.txt3 }]}>
                  {typeof l.meta === 'string' ? l.meta : JSON.stringify(l.meta)}
                </Text>
              ) : null}
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { fontSize: 11 },
  msg: { fontSize: 13, fontWeight: '700', marginTop: 8 },
  meta: { fontSize: 11, marginTop: 6, fontFamily: 'monospace' },
});

export default AdminLogs;
