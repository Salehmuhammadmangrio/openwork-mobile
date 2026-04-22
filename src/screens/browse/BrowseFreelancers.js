import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Input, Chip, Loading, EmptyState, Avatar } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, safeArray, truncate } from '../../utils/helpers';

const CATS = ['All', 'Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science / AI', 'Content Writing'];

const BrowseFreelancers = ({ navigation }) => {
  const { colors } = useTheme();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const params = { limit: 40 };
      if (q.trim()) params.search = q.trim();
      if (cat && cat !== 'All') params.category = cat;
      const { data } = await api.get('/users/freelancers', { params });
      setItems(safeArray(data?.freelancers || data?.users));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [q, cat]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const renderItem = ({ item: f }) => (
    <Card style={{ marginBottom: 12 }} onPress={() => navigation.navigate('FreelancerProfile', { id: f._id })}>
      <View style={styles.row}>
        <Avatar size={56} name={f.fullName || 'Freelancer'} src={f.avatarUrl} />
        <View style={{ flex: 1 }}>
          <View style={styles.rowSpace}>
            <Text numberOfLines={1} style={[styles.name, { color: colors.txt }]}>{f.fullName || 'Freelancer'}</Text>
            {typeof f.aiScore === 'number' ? (
              <Badge variant="primary">AI {f.aiScore}</Badge>
            ) : null}
          </View>
          <Text numberOfLines={1} style={[styles.title, { color: colors.txt2 }]}>{f.title || f.headline || 'Freelancer'}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={13} color={colors.warn} />
            <Text style={[styles.rating, { color: colors.txt }]}>{(f.rating || 0).toFixed(1)}</Text>
            <Text style={[styles.meta, { color: colors.txt3 }]}>({f.totalReviews || 0})</Text>
            <Text style={[styles.dot, { color: colors.txt3 }]}>·</Text>
            <Text style={[styles.rate, { color: colors.ok }]}>
              {formatCurrency(f.hourlyRate || 0)}/hr
            </Text>
          </View>
          {f.bio ? (
            <Text numberOfLines={2} style={[styles.bio, { color: colors.txt2 }]}>
              {truncate(f.bio, 150)}
            </Text>
          ) : null}
          <View style={styles.skillWrap}>
            {safeArray(f.skills).slice(0, 4).map((s) => (
              <Badge key={s} variant="neutral" style={{ marginRight: 6, marginBottom: 6 }}>{s}</Badge>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 16 }}>
        <Input
          placeholder="Search freelancers…"
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
      ) : items.length === 0 ? (
        <EmptyState icon="people-outline" title="No freelancers found" description="Try adjusting your filters." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(f) => f._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  rowSpace: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  name: { fontSize: 15, fontWeight: '800', flex: 1 },
  title: { fontSize: 12, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  rating: { fontSize: 12, fontWeight: '800' },
  meta: { fontSize: 11 },
  dot: { fontSize: 11 },
  rate: { fontSize: 12, fontWeight: '800' },
  bio: { fontSize: 12, lineHeight: 18, marginTop: 8 },
  skillWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
});

export default BrowseFreelancers;
