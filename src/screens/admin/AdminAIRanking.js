import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input, Loading, Alert } from '../../components/ui';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const FIELDS = [
  ['skillMatch', 'Skill match weight'],
  ['aiScore', 'AI score weight'],
  ['rating', 'Rating weight'],
  ['priceScore', 'Price competitiveness'],
  ['recency', 'Recency boost'],
  ['experience', 'Experience weight'],
];

const AdminAIRanking = ({ navigation }) => {
  const { colors } = useTheme();
  const [weights, setWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/ai-ranking');
        const w = data?.weights || {};
        const str = {};
        Object.keys(w).forEach((k) => (str[k] = String(w[k])));
        setWeights(str);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {};
      Object.keys(weights).forEach((k) => {
        const n = parseFloat(weights[k]);
        if (!Number.isNaN(n)) payload[k] = n;
      });
      await api.put('/admin/ai-ranking', { weights: payload });
      toast.success('Saved');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Screen header={<Header title="AI ranking" onBack={() => navigation.goBack()} />}><Loading /></Screen>;

  return (
    <Screen scroll keyboardAware header={<Header title="AI ranking" onBack={() => navigation.goBack()} />}>
      <Alert variant="info" title="Fine-tune search ranking">
        Values are multipliers (0 – 1). They control how much each signal contributes to the final score.
      </Alert>
      <Card style={{ marginTop: 12 }}>
        {FIELDS.map(([key, label]) => (
          <Input
            key={key}
            label={label}
            value={weights[key] || ''}
            onChangeText={(v) => setWeights({ ...weights, [key]: v })}
            keyboardType="decimal-pad"
            placeholder="0.0 – 1.0"
          />
        ))}
      </Card>
      <Button title="Save weights" full size="lg" loading={saving} onPress={save} style={{ marginTop: 14 }} />
    </Screen>
  );
};

export default AdminAIRanking;
