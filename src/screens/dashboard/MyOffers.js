import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Button } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, safeArray } from '../../utils/helpers';

const MyOffers = ({ navigation }) => {
  const { colors } = useTheme();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const { data } = await api.get('/offers/mine');
      setOffers(safeArray(data?.offers));
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Screen padded={false} header={
      <Header title="My offers" onBack={() => navigation.goBack()}
        right={<Button title="New" size="xs" onPress={() => navigation.navigate('EditOffer')} />}
      />
    }>
      {loading ? (
        <Loading />
      ) : offers.length === 0 ? (
        <EmptyState icon="pricetag-outline" title="No offers yet" description="Create your first offer to start receiving orders." actionLabel="Create offer" onAction={() => navigation.navigate('EditOffer')} />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(o) => o._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: o }) => (
            <Card style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }} onPress={() => navigation.navigate('OfferDetail', { id: o._id })}>
              {o.thumbnail ? (
                <Image source={{ uri: o.thumbnail }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, { backgroundColor: colors.s2, alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="image-outline" size={36} color={colors.txt3} />
                </View>
              )}
              <View style={{ padding: 12 }}>
                <View style={styles.rowBetween}>
                  <Text numberOfLines={1} style={[styles.title, { color: colors.txt }]}>{o.title}</Text>
                  <Badge variant={o.status === 'active' ? 'success' : 'neutral'}>
                    {(o.status || 'ACTIVE').toUpperCase()}
                  </Badge>
                </View>
                <View style={styles.rowBetween}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="star" size={12} color={colors.warn} />
                      <Text style={[styles.meta, { color: colors.txt2 }]}>{(o.rating || 0).toFixed(1)}</Text>
                    </View>
                    <Text style={[styles.meta, { color: colors.txt3 }]}>
                      {o.totalOrders || 0} orders
                    </Text>
                  </View>
                  <Text style={[styles.price, { color: colors.primary2 }]}>
                    {formatCurrency(o.packages?.[0]?.price || 0)}+
                  </Text>
                </View>
                <Button title="Edit" variant="ghost" size="sm" style={{ marginTop: 10, alignSelf: 'flex-start' }} onPress={() => navigation.navigate('EditOffer', { id: o._id })} />
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  thumb: { width: '100%', height: 140 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, gap: 8 },
  title: { fontSize: 15, fontWeight: '800', flex: 1 },
  meta: { fontSize: 12 },
  price: { fontSize: 14, fontWeight: '800' },
});

export default MyOffers;
