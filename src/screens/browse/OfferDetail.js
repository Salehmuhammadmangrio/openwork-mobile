import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Button, Loading, EmptyState, Avatar } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, safeArray } from '../../utils/helpers';

const OfferDetail = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { id } = route.params || {};
  const [offer, setOffer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/offers/${id}`),
      api.get(`/reviews/offer/${id}`, { params: { limit: 10, page: 1 } }),
    ])
      .then(([o, r]) => {
        setOffer(o.data?.offer || o.data);
        setReviews(safeArray(r.data?.reviews));
      })
      .catch(() => setOffer(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Screen header={<Header title="Offer" onBack={() => navigation.goBack()} />}><Loading /></Screen>;
  }
  if (!offer) {
    return (
      <Screen header={<Header title="Offer" onBack={() => navigation.goBack()} />}>
        <EmptyState icon="alert-circle-outline" title="Offer not found" />
      </Screen>
    );
  }

  const packages = safeArray(offer.packages);
  const activePackage = packages[tier] || null;

  return (
    <Screen scroll header={<Header title="Offer" onBack={() => navigation.goBack()} />}>
      {offer.thumbnail ? (
        <Image source={{ uri: offer.thumbnail }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: colors.s2, alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name="image-outline" size={60} color={colors.txt3} />
        </View>
      )}
      <Card style={{ marginTop: 12 }}>
        <Text style={[styles.title, { color: colors.txt }]}>{offer.title}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={14} color={colors.warn} />
          <Text style={[styles.rating, { color: colors.txt }]}>{(offer.rating || 0).toFixed(1)}</Text>
          <Text style={[styles.meta, { color: colors.txt3 }]}>({offer.totalReviews || 0} reviews)</Text>
        </View>
      </Card>

      <Card style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
        onPress={() => offer.freelancer?._id && navigation.navigate('FreelancerProfile', { id: offer.freelancer._id })}
      >
        <Avatar size={48} name={offer.freelancer?.fullName || 'U'} src={offer.freelancer?.avatarUrl} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.txt }]}>{offer.freelancer?.fullName || 'Freelancer'}</Text>
          <Text style={[styles.role, { color: colors.txt3 }]}>{offer.freelancer?.title || 'Freelancer'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.txt3} />
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Text style={[styles.h, { color: colors.txt }]}>About this offer</Text>
        <Text style={[styles.body, { color: colors.txt2 }]}>{offer.description}</Text>
      </Card>

      {packages.length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>Packages</Text>
          <View style={styles.tierTabs}>
            {packages.map((p, i) => (
              <Pressable
                key={p.name || i}
                onPress={() => setTier(i)}
                style={[
                  styles.tierTab,
                  {
                    backgroundColor: i === tier ? 'rgba(108,78,246,0.14)' : colors.s2,
                    borderColor: i === tier ? colors.primary : colors.b2,
                  },
                ]}
              >
                <Text style={[styles.tierName, { color: i === tier ? colors.primary2 : colors.txt2 }]}>
                  {p.name || ['Basic', 'Standard', 'Premium'][i]}
                </Text>
                <Text style={[styles.tierPrice, { color: colors.txt }]}>{formatCurrency(p.price || 0)}</Text>
              </Pressable>
            ))}
          </View>
          {activePackage ? (
            <View>
              <Text style={[styles.body, { color: colors.txt2, marginBottom: 10 }]}>
                {activePackage.description}
              </Text>
              {safeArray(activePackage.features).map((f, i) => (
                <View key={i} style={styles.featLine}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.ok} />
                  <Text style={[styles.featTxt, { color: colors.txt2 }]}>{f}</Text>
                </View>
              ))}
              <View style={styles.metaLine}>
                <Ionicons name="time-outline" size={14} color={colors.txt3} />
                <Text style={[styles.metaSmall, { color: colors.txt3 }]}>
                  {activePackage.deliveryDays || '—'} day delivery
                </Text>
                <Text style={[styles.metaSmall, { color: colors.txt3 }]}>·</Text>
                <Ionicons name="refresh-outline" size={14} color={colors.txt3} />
                <Text style={[styles.metaSmall, { color: colors.txt3 }]}>
                  {activePackage.revisions || 0} revisions
                </Text>
              </View>
            </View>
          ) : null}
        </Card>
      )}

      {reviews.length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>Reviews</Text>
          {reviews.map((r) => (
            <View key={r._id} style={styles.reviewRow}>
              <Avatar size={32} name={r.reviewer?.fullName} src={r.reviewer?.avatarUrl} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.revName, { color: colors.txt }]}>{r.reviewer?.fullName}</Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: r.rating || 5 }).map((_, i) => (
                    <Ionicons key={i} name="star" size={11} color={colors.warn} />
                  ))}
                </View>
                <Text style={[styles.revText, { color: colors.txt2 }]}>{r.comment}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}

      <View style={{ height: 14 }} />
      <Button
        title={`Continue${activePackage ? ` · ${formatCurrency(activePackage.price || 0)}` : ''}`}
        size="lg"
        full
        onPress={() => navigation.navigate('CreateOrder', { offerId: id, tier, offer })}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  thumb: { width: '100%', height: 200, borderRadius: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  rating: { fontSize: 13, fontWeight: '800' },
  meta: { fontSize: 12 },
  name: { fontSize: 14, fontWeight: '800' },
  role: { fontSize: 12, marginTop: 2 },
  h: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
  tierTabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tierTab: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  tierName: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  tierPrice: { fontSize: 15, fontWeight: '800', marginTop: 4 },
  featLine: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
  featTxt: { fontSize: 13, flex: 1 },
  metaLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  metaSmall: { fontSize: 12 },
  reviewRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  revName: { fontSize: 13, fontWeight: '800' },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 3, marginBottom: 4 },
  revText: { fontSize: 12, lineHeight: 18 },
});

export default OfferDetail;
