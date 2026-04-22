import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input, Textarea, Alert } from '../../components/ui';
import api from '../../utils/api';
import { toast } from '../../utils/toast';
import { formatCurrency } from '../../utils/helpers';

const CreateOrder = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { freelancerId, offerId, offer, tier = 0, freelancer } = route.params || {};

  const activePkg = offer?.packages?.[tier];

  const [title, setTitle] = useState(offer?.title || freelancer?.fullName ? `Project with ${freelancer?.fullName || 'Freelancer'}` : '');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState(String(activePkg?.price || ''));
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title || !description || !totalAmount) return toast.error('All fields are required');
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        totalAmount: parseFloat(totalAmount),
      };
      if (offerId) { payload.offerId = offerId; payload.packageTier = tier; }
      if (freelancerId) payload.freelancerId = freelancerId;
      const { data } = await api.post('/orders', payload);
      const order = data?.order || data;
      toast.success('Order created');
      navigation.replace('Checkout', { orderId: order?._id, amount: parseFloat(totalAmount) });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Could not create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboardAware header={<Header title="New order" onBack={() => navigation.goBack()} />}>
      <Alert variant="info" title="Secure escrow">
        Funds are held securely until you approve the delivery.
      </Alert>
      <Card style={{ marginTop: 12 }}>
        {offer ? (
          <View style={styles.summary}>
            <Text style={[styles.sTitle, { color: colors.txt }]}>{offer.title}</Text>
            {activePkg ? (
              <Text style={[styles.sMeta, { color: colors.txt2 }]}>
                {activePkg.name || ['Basic', 'Standard', 'Premium'][tier]} · {formatCurrency(activePkg.price)} · {activePkg.deliveryDays} days
              </Text>
            ) : null}
          </View>
        ) : freelancer ? (
          <Text style={[styles.sTitle, { color: colors.txt }]}>Hiring {freelancer.fullName}</Text>
        ) : null}

        <Input label="Project title" value={title} onChangeText={setTitle} />
        <Textarea label="Project description" value={description} onChangeText={setDescription} rows={5} placeholder="Describe the scope, timeline, and success criteria…" />
        <Input label="Total budget ($)" value={totalAmount} onChangeText={setTotalAmount} keyboardType="decimal-pad" />
      </Card>
      <Button title={`Create order · ${formatCurrency(parseFloat(totalAmount) || 0)}`} full size="lg" loading={loading} onPress={submit} style={{ marginTop: 14 }} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  summary: { marginBottom: 14 },
  sTitle: { fontSize: 15, fontWeight: '800' },
  sMeta: { fontSize: 12, marginTop: 4 },
});

export default CreateOrder;
