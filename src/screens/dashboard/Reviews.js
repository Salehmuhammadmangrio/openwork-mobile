import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Loading, EmptyState, Avatar } from '../../components/ui';
import api from '../../utils/api';
import { useAuthStore } from '../../store';
import { formatRelative, safeArray } from '../../utils/helpers';

const Reviews = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get(`/reviews/user/${user?._id}`);
      setItems(safeArray(data?.reviews));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  useEffect(() => { if (user?._id) load(); }, [load, user?._id]);

  const avg = items.length ? (items.reduce((a, r) => a + (r.rating || 0), 0) / items.length) : 0;

  return (
    <Screen padded={false} header={<Header title="Reviews" onBack={() => navigation.goBack()} />}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Card style={{ alignItems: 'center', paddingVertical: 22 }}>
          <Text style={[styles.avg, { color: colors.txt }]}>{avg.toFixed(1)}</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons key={i} name={i < Math.round(avg) ? 'star' : 'star-outline'} size={18} color={colors.warn} />
            ))}
          </View>
          <Text style={[styles.sub, { color: colors.txt3 }]}>
            {items.length} review{items.length === 1 ? '' : 's'}
          </Text>
        </Card>
      </View>
      {loading ? <Loading /> : items.length === 0 ? (
        <EmptyState icon="star-outline" title="No reviews yet" description="Reviews will appear here once a completed order is rated." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(r) => r._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: r }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Avatar size={36} name={r.reviewer?.fullName} src={r.reviewer?.avatarUrl} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: colors.txt }]}>{r.reviewer?.fullName || 'Reviewer'}</Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons key={i} name={i < (r.rating || 0) ? 'star' : 'star-outline'} size={12} color={colors.warn} />
                    ))}
                    <Text style={[styles.date, { color: colors.txt3 }]}>· {formatRelative(r.createdAt)}</Text>
                  </View>
                  <Text style={[styles.comment, { color: colors.txt2 }]}>{r.comment}</Text>
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
  avg: { fontSize: 46, fontWeight: '900' },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 4, alignItems: 'center' },
  sub: { fontSize: 12, marginTop: 6 },
  name: { fontSize: 14, fontWeight: '800' },
  date: { fontSize: 11, marginLeft: 4 },
  comment: { fontSize: 13, lineHeight: 19, marginTop: 6 },
});

export default Reviews;
