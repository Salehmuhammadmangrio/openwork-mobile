import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Avatar } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatRelative, safeArray, truncate } from '../../utils/helpers';

const ReceivedProposals = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { jobId } = route.params || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const url = jobId ? `/proposals/job/${jobId}/all` : '/proposals/received';
      const { data } = await api.get(url);
      setItems(safeArray(data?.proposals));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [jobId]);

  useEffect(() => { load(); }, [load]);

  return (
    <Screen padded={false} header={<Header title="Proposals received" onBack={() => navigation.goBack()} />}>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="albums-outline" title="No proposals yet" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => p._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: p }) => (
            <Card style={{ marginBottom: 10 }} onPress={() => navigation.navigate('ViewProposal', { id: p._id })}>
              <View style={styles.row}>
                <Avatar size={40} name={p.freelancer?.fullName} src={p.freelancer?.avatarUrl} />
                <View style={{ flex: 1 }}>
                  <View style={styles.head}>
                    <Text numberOfLines={1} style={[styles.name, { color: colors.txt }]}>{p.freelancer?.fullName || 'Freelancer'}</Text>
                    <Badge variant={p.status === 'accepted' ? 'success' : p.status === 'rejected' ? 'danger' : 'info'}>
                      {(p.status || 'PENDING').toUpperCase()}
                    </Badge>
                  </View>
                  <Text style={[styles.job, { color: colors.txt3 }]} numberOfLines={1}>{p.job?.title || ''}</Text>
                  <Text numberOfLines={2} style={[styles.body, { color: colors.txt2 }]}>{truncate(p.coverLetter || '', 120)}</Text>
                  <View style={styles.foot}>
                    <Text style={[styles.bid, { color: colors.ok }]}>{formatCurrency(p.bidAmount || 0)}</Text>
                    <Text style={[styles.meta, { color: colors.txt3 }]}>{formatRelative(p.createdAt)}</Text>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { fontSize: 14, fontWeight: '800', flex: 1 },
  job: { fontSize: 12, marginTop: 3 },
  body: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  bid: { fontSize: 13, fontWeight: '800' },
  meta: { fontSize: 11 },
});

export default ReceivedProposals;
