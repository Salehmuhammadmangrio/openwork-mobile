import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Button } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatRelative, safeArray } from '../../utils/helpers';

const MyJobs = ({ navigation }) => {
  const { colors } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/jobs/mine');
      setJobs(safeArray(data?.jobs));
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Screen padded={false} header={
      <Header title="My jobs" onBack={() => navigation.goBack()}
        right={<Button title="Post" size="xs" onPress={() => navigation.navigate('PostJob')} />}
      />
    }>
      {loading ? (
        <Loading />
      ) : jobs.length === 0 ? (
        <EmptyState icon="briefcase-outline" title="No jobs posted" actionLabel="Post a job" onAction={() => navigation.navigate('PostJob')} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => j._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: j }) => (
            <Card style={{ marginBottom: 10 }} onPress={() => navigation.navigate('JobDetail', { id: j._id })}>
              <View style={styles.head}>
                <Text numberOfLines={2} style={[styles.title, { color: colors.txt }]}>{j.title}</Text>
                <Badge variant={j.status === 'open' ? 'success' : j.status === 'closed' ? 'danger' : 'neutral'}>
                  {(j.status || 'OPEN').toUpperCase()}
                </Badge>
              </View>
              <Text style={[styles.meta, { color: colors.txt3 }]}>
                {j.proposals?.length || 0} proposals · {formatRelative(j.createdAt)}
              </Text>
              <Text style={[styles.budget, { color: colors.ok }]}>
                {formatCurrency(j.budgetMin || 0)} – {formatCurrency(j.budgetMax || 0)}
              </Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { fontSize: 15, fontWeight: '800', flex: 1, lineHeight: 20 },
  meta: { fontSize: 12, marginTop: 6 },
  budget: { fontSize: 13, fontWeight: '800', marginTop: 6 },
});

export default MyJobs;
