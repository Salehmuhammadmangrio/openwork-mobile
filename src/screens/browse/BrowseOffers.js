import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Card, Badge, Input, Chip, Loading, EmptyState, Avatar } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, safeArray, truncate } from '../../utils/helpers';

const CATS = ['All', 'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design', 'Data Science / AI', 'Content Writing', 'Digital Marketing'];

const BrowseOffers = ({ navigation }) => {
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
      const { data } = await api.get('/offers', { params });
      setItems(safeArray(data?.offers));
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

  const renderItem = ({ item: o }) => (
    <Card style={styles.card} padding={0} onPress={() => navigation.navigate('OfferDetail', { id: o._id })}>
      {o.thumbnail ? (
        <Image source={{ uri: o.thumbnail }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: colors.s2, alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name="image-outline" size={40} color={colors.txt3} />
        </View>
      )}
      <View style={{ padding: 12 }}>
        <View style={styles.rowSpace}>
          <Avatar size={28} name={o.freelancer?.fullName || 'U'} src={o.freelancer?.avatarUrl} />
          <Text numberOfLines={1} style={[styles.sellerName, { color: colors.txt2 }]}>
            {o.freelancer?.fullName || 'Freelancer'}
          </Text>
        </View>
        <Text numberOfLines={2} style={[styles.title, { color: colors.txt }]}>{o.title}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={colors.warn} />
          <Text style={[styles.rating, { color: colors.txt }]}>{(o.rating || 0).toFixed(1)}</Text>
          <Text style={[styles.reviews, { color: colors.txt3 }]}>
            ({o.totalReviews || 0})
          </Text>
        </View>
        <View style={styles.rowSpace}>
          <Text style={[styles.startAt, { color: colors.txt3 }]}>Starting at</Text>
          <Text style={[styles.price, { color: colors.primary2 }]}>
            {formatCurrency(o.packages?.[0]?.price || o.price || 0)}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 16 }}>
        <Input
          placeholder="Search offers…"
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
        <EmptyState icon="pricetags-outline" title="No offers found" description="Try different keywords or remove filters." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(o) => o._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, overflow: 'hidden' },
  thumb: { width: '100%', height: 120, backgroundColor: '#222' },
  rowSpace: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, justifyContent: 'space-between' },
  sellerName: { fontSize: 11, fontWeight: '600', flex: 1 },
  title: { fontSize: 13, fontWeight: '700', lineHeight: 18, marginTop: 6, minHeight: 36 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  rating: { fontSize: 12, fontWeight: '800' },
  reviews: { fontSize: 11 },
  startAt: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  price: { fontSize: 14, fontWeight: '800' },
});

export default BrowseOffers;
