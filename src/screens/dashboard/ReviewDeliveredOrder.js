import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Textarea, Loading, Alert } from '../../components/ui';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const ReviewDeliveredOrder = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data?.order || data);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const accept = async () => {
    setBusy(true);
    try {
      await api.put(`/orders/${orderId}/accept-delivery`);
      if (rating && comment.trim()) {
        await api.post('/reviews', { orderId, rating, comment }).catch(() => null);
      }
      toast.success('Delivery accepted');
      navigation.goBack();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    setBusy(true);
    try {
      await api.put(`/orders/${orderId}/reject-delivery`, { reason: comment || undefined });
      toast.success('Revision requested');
      navigation.goBack();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Screen header={<Header title="Review delivery" onBack={() => navigation.goBack()} />}><Loading /></Screen>;

  return (
    <Screen scroll keyboardAware header={<Header title="Review delivery" onBack={() => navigation.goBack()} />}>
      <Card>
        <Text style={[styles.h, { color: colors.txt }]}>Delivery message</Text>
        <Text style={[styles.body, { color: colors.txt2 }]}>{order?.deliveryMessage || '—'}</Text>
        {order?.deliveryFileUrl ? (
          <Pressable onPress={() => Linking.openURL(order.deliveryFileUrl)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <Ionicons name="attach" size={18} color={colors.primary2} />
            <Text style={{ color: colors.primary2, fontSize: 13, fontWeight: '700' }}>Open attachment</Text>
          </Pressable>
        ) : null}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Text style={[styles.h, { color: colors.txt }]}>Rate this work</Text>
        <View style={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Pressable key={i} onPress={() => setRating(i + 1)} hitSlop={8}>
              <Ionicons name={i < rating ? 'star' : 'star-outline'} size={36} color={colors.warn} />
            </Pressable>
          ))}
        </View>
        <Textarea
          label="Comment"
          value={comment}
          onChangeText={setComment}
          placeholder="What went well? What could be improved?"
          rows={4}
        />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Button title="Request revision" variant="danger" full style={{ flex: 1 }} loading={busy} onPress={reject} />
        <Button title="Accept delivery" full style={{ flex: 1 }} loading={busy} onPress={accept} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  h: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  body: { fontSize: 14, lineHeight: 21 },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 14 },
});

export default ReviewDeliveredOrder;
