import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Button, Loading, EmptyState, Avatar } from '../../components/ui';
import api from '../../utils/api';
import { useAuthStore, useChatStore } from '../../store';
import { formatCurrency, safeArray } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const FreelancerProfile = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { id } = route.params || {};
  const user = useAuthStore((s) => s.user);
  const startConv = useChatStore((s) => s.startConversation);

  const [fl, setFl] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/reviews/user/${id}`),
    ])
      .then(([u, r]) => {
        setFl(u.data?.user || u.data);
        setReviews(safeArray(r.data?.reviews));
      })
      .catch(() => setFl(null))
      .finally(() => setLoading(false));
  }, [id]);

  const startChat = async () => {
    try {
      const conv = await startConv(id);
      if (conv?._id) {
        navigation.navigate('ChatScreen', { conversationId: conv._id, peer: fl });
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Could not start chat');
    }
  };

  if (loading) {
    return <Screen header={<Header title="Profile" onBack={() => navigation.goBack()} />}><Loading /></Screen>;
  }
  if (!fl) {
    return (
      <Screen header={<Header title="Profile" onBack={() => navigation.goBack()} />}>
        <EmptyState icon="alert-circle-outline" title="Profile not found" />
      </Screen>
    );
  }

  return (
    <Screen scroll header={<Header title={fl.fullName || 'Profile'} onBack={() => navigation.goBack()} />}>
      <Card>
        <View style={styles.heroRow}>
          <Avatar size={72} name={fl.fullName} src={fl.avatarUrl} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.txt }]}>{fl.fullName}</Text>
            <Text style={[styles.role, { color: colors.txt2 }]}>{fl.title || fl.headline || 'Freelancer'}</Text>
            {typeof fl.aiScore === 'number' ? (
              <Badge variant="primary" style={{ marginTop: 6 }}>AI score {fl.aiScore}</Badge>
            ) : null}
          </View>
        </View>
        <View style={styles.statsRow}>
          <Stat colors={colors} label="Rate" value={`${formatCurrency(fl.hourlyRate || 0)}/hr`} />
          <Stat colors={colors} label="Rating" value={`${(fl.rating || 0).toFixed(1)} (${fl.totalReviews || 0})`} />
          <Stat colors={colors} label="Jobs done" value={`${fl.completedJobs || 0}`} />
        </View>
      </Card>

      {user && user._id !== id ? (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Button title="Message" variant="secondary" full style={{ flex: 1 }} onPress={startChat} />
          <Button title="Hire directly" full style={{ flex: 1 }} onPress={() => navigation.navigate('CreateOrder', { freelancerId: id, freelancer: fl })} />
        </View>
      ) : null}

      {fl.bio ? (
        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>About</Text>
          <Text style={[styles.body, { color: colors.txt2 }]}>{fl.bio}</Text>
        </Card>
      ) : null}

      {safeArray(fl.skills).length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>Skills</Text>
          <View style={styles.skills}>
            {fl.skills.map((s) => (
              <Badge key={s} variant="primary" style={{ marginRight: 6, marginBottom: 6 }}>{s}</Badge>
            ))}
          </View>
        </Card>
      )}

      {safeArray(fl.portfolio).length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>Portfolio</Text>
          {fl.portfolio.map((p, i) => (
            <View key={i} style={styles.pItem}>
              <Text style={[styles.pTitle, { color: colors.txt }]}>{p.title}</Text>
              <Text style={[styles.pDesc, { color: colors.txt2 }]}>{p.description}</Text>
            </View>
          ))}
        </Card>
      )}

      {reviews.length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>Reviews</Text>
          {reviews.slice(0, 5).map((r) => (
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
    </Screen>
  );
};

const Stat = ({ label, value, colors }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ color: colors.txt, fontSize: 15, fontWeight: '800' }}>{value}</Text>
    <Text style={{ color: colors.txt3, fontSize: 11, marginTop: 4 }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  name: { fontSize: 18, fontWeight: '800' },
  role: { fontSize: 13, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 14, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  h: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
  skills: { flexDirection: 'row', flexWrap: 'wrap' },
  pItem: { marginBottom: 12 },
  pTitle: { fontSize: 14, fontWeight: '800' },
  pDesc: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  reviewRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  revName: { fontSize: 13, fontWeight: '800' },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 3, marginBottom: 4 },
  revText: { fontSize: 12, lineHeight: 18 },
});

export default FreelancerProfile;
