import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Button, Loading, EmptyState, Avatar } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatRelative } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const ViewProposal = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { id } = route.params || {};
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/proposals/${id}`);
        setP(data?.proposal || data);
      } catch {
        setP(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const act = async (action) => {
    setActing(true);
    try {
      await api.put(`/proposals/${id}/${action}`);
      toast.success(`Proposal ${action}ed`);
      navigation.goBack();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setActing(false);
    }
  };

  if (loading) return <Screen header={<Header title="Proposal" onBack={() => navigation.goBack()} />}><Loading /></Screen>;
  if (!p) return (
    <Screen header={<Header title="Proposal" onBack={() => navigation.goBack()} />}>
      <EmptyState icon="document-outline" title="Proposal not found" />
    </Screen>
  );

  return (
    <Screen scroll header={<Header title="Proposal" onBack={() => navigation.goBack()} />}>
      <Card style={{ flexDirection: 'row', gap: 12 }}>
        <Avatar size={48} name={p.freelancer?.fullName} src={p.freelancer?.avatarUrl} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.txt }]}>{p.freelancer?.fullName || 'Freelancer'}</Text>
          <Text style={[styles.meta, { color: colors.txt3 }]}>{formatRelative(p.createdAt)}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
            <Badge variant={p.status === 'accepted' ? 'success' : p.status === 'rejected' ? 'danger' : 'info'}>
              {(p.status || 'pending').toUpperCase()}
            </Badge>
            {p.isAIGenerated ? <Badge variant="primary">AI</Badge> : null}
          </View>
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <View style={styles.rowGap}>
          <View>
            <Text style={[styles.label, { color: colors.txt3 }]}>Bid amount</Text>
            <Text style={[styles.val, { color: colors.ok }]}>{formatCurrency(p.bidAmount || 0)}</Text>
          </View>
          <View>
            <Text style={[styles.label, { color: colors.txt3 }]}>Delivery</Text>
            <Text style={[styles.val, { color: colors.txt }]}>{p.deliveryTime || '—'}</Text>
          </View>
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Text style={[styles.h, { color: colors.txt }]}>Cover letter</Text>
        <Text style={[styles.body, { color: colors.txt2 }]}>{p.coverLetter}</Text>
      </Card>

      {p.status === 'pending' ? (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Button title="Reject" variant="danger" full style={{ flex: 1 }} loading={acting} onPress={() => act('reject')} />
          <Button title="Accept" full style={{ flex: 1 }} loading={acting} onPress={() => act('accept')} />
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  name: { fontSize: 15, fontWeight: '800' },
  meta: { fontSize: 12, marginTop: 2 },
  rowGap: { flexDirection: 'row', gap: 24 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  val: { fontSize: 18, fontWeight: '800' },
  h: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
});

export default ViewProposal;
