import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatRelative, safeArray, truncate } from '../../utils/helpers';

const Proposals = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/proposals/mine');
      setItems(safeArray(data?.proposals));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Screen padded={false} header={<Header title="My proposals" onBack={() => navigation.goBack()} />}>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="document-text-outline" title="No proposals yet" description="Send your first proposal from the jobs list." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => p._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: p }) => (
            <Card style={{ marginBottom: 10 }} onPress={() => p.job?._id && navigation.navigate('JobDetail', { id: p.job._id })}>
              <View style={styles.head}>
                <Text numberOfLines={2} style={[styles.title, { color: colors.txt }]}>{p.job?.title || 'Proposal'}</Text>
                <Badge variant={p.status === 'accepted' ? 'success' : p.status === 'rejected' ? 'danger' : 'info'}>
                  {(p.status || 'PENDING').toUpperCase()}
                </Badge>
              </View>
              <Text numberOfLines={2} style={[styles.body, { color: colors.txt2 }]}>
                {truncate(p.coverLetter || '', 140)}
              </Text>
              <View style={styles.footer}>
                <Text style={[styles.bid, { color: colors.ok }]}>{formatCurrency(p.bidAmount || 0)}</Text>
                <Text style={[styles.meta, { color: colors.txt3 }]}>{formatRelative(p.createdAt)}</Text>
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
  body: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  bid: { fontSize: 13, fontWeight: '800' },
  meta: { fontSize: 11 },
});

export default Proposals;
