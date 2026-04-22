import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Input, Chip, Loading, EmptyState } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatRelative, safeArray, truncate } from '../../utils/helpers';

const CATS = ['All', 'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design', 'Data Science / AI', 'Content Writing', 'Digital Marketing', 'DevOps & Cloud'];

const BrowseJobs = ({ navigation }) => {
  const { colors } = useTheme();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (showSpin = true) => {
    if (showSpin) setLoading(true);
    try {
      const params = { limit: 40 };
      if (q.trim()) params.search = q.trim();
      if (cat && cat !== 'All') params.category = cat;
      const { data } = await api.get('/jobs', { params });
      setJobs(safeArray(data?.jobs));
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [q, cat]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const onRefresh = () => { setRefreshing(true); load(false); };

  const renderItem = ({ item: j }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('JobDetail', { id: j._id })}>
      <View style={styles.headRow}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.txt }]}>{j.title}</Text>
        {j.isUrgent ? <Badge variant="warning">URGENT</Badge> : null}
      </View>
      <Text style={[styles.meta, { color: colors.txt3 }]}>
        {j.client?.companyName || j.client?.fullName || 'Client'} · {j.category || 'General'}
      </Text>
      <Text numberOfLines={3} style={[styles.desc, { color: colors.txt2 }]}>
        {truncate(j.description || '', 180)}
      </Text>
      <View style={styles.skillRow}>
        {safeArray(j.skills).slice(0, 4).map((s) => (
          <Badge key={s} variant="neutral" style={{ marginRight: 6, marginBottom: 6 }}>{s}</Badge>
        ))}
        {j.skills?.length > 4 ? (
          <Badge variant="neutral">+{j.skills.length - 4}</Badge>
        ) : null}
      </View>
      <View style={styles.footerRow}>
        <View style={styles.budgetRow}>
          <Ionicons name="cash-outline" size={14} color={colors.ok} />
          <Text style={[styles.budget, { color: colors.ok }]}>
            {formatCurrency(j.budgetMin || 0)} – {formatCurrency(j.budgetMax || 0)}
          </Text>
        </View>
        <Text style={[styles.meta, { color: colors.txt3 }]}>{formatRelative(j.createdAt)}</Text>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.filters}>
        <Input
          placeholder="Search jobs…"
          value={q}
          onChangeText={setQ}
          leftIcon={<Ionicons name="search" size={18} color={colors.txt3} />}
          containerStyle={{ marginBottom: 8 }}
        />
        <FlatList
          data={CATS}
          horizontal
          keyExtractor={(x) => x}
          renderItem={({ item }) => (
            <Chip label={item} active={cat === item} onPress={() => setCat(item)} style={{ marginRight: 8 }} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        />
      </View>
      {loading ? (
        <Loading />
      ) : jobs.length === 0 ? (
        <EmptyState icon="briefcase-outline" title="No jobs found" description="Try different keywords or remove filters." />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => j._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filters: { paddingHorizontal: 16 },
  card: { marginBottom: 12 },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  title: { fontSize: 16, fontWeight: '800', flex: 1, lineHeight: 22 },
  meta: { fontSize: 12, marginTop: 4 },
  desc: { fontSize: 13, lineHeight: 19, marginTop: 10 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  budget: { fontSize: 13, fontWeight: '800' },
});

export default BrowseJobs;
