import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input, Textarea, Alert } from '../../components/ui';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const DeliverOrder = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { orderId } = route.params || {};
  const [message, setMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!message.trim()) return toast.error('Add a delivery message');
    setBusy(true);
    try {
      await api.put(`/orders/${orderId}/deliver`, {
        message,
        deliveryFileUrl: fileUrl || undefined,
      });
      toast.success('Delivery submitted');
      navigation.goBack();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll keyboardAware header={<Header title="Deliver order" onBack={() => navigation.goBack()} />}>
      <Alert variant="info" title="Submit your delivery">
        The client will review your work. Once they approve, the escrow is released and the order is marked complete.
      </Alert>
      <Card style={{ marginTop: 12 }}>
        <Textarea
          label="Delivery message"
          value={message}
          onChangeText={setMessage}
          placeholder="Summarize what you delivered and any instructions the client needs…"
          rows={6}
        />
        <Input
          label="File / link (optional)"
          value={fileUrl}
          onChangeText={setFileUrl}
          placeholder="https://drive.google.com/…"
          leftIcon={<Ionicons name="link-outline" size={18} color={colors.txt3} />}
          autoCapitalize="none"
        />
      </Card>
      <Button title="Submit delivery" full size="lg" loading={busy} onPress={submit} style={{ marginTop: 14 }} />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default DeliverOrder;
