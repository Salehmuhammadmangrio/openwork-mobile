import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input, Textarea, Loading } from '../../components/ui';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const EditOffer = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { id } = route.params || {};
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Web Development',
    packages: [
      { name: 'Basic', price: '', deliveryDays: '', revisions: '1', description: '', features: '' },
      { name: 'Standard', price: '', deliveryDays: '', revisions: '2', description: '', features: '' },
      { name: 'Premium', price: '', deliveryDays: '', revisions: '3', description: '', features: '' },
    ],
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await api.get(`/offers/${id}`);
        const o = data?.offer || data;
        setForm({
          title: o.title || '',
          description: o.description || '',
          category: o.category || 'Web Development',
          packages: (o.packages?.length ? o.packages : form.packages).map((p, i) => ({
            name: p.name || ['Basic', 'Standard', 'Premium'][i],
            price: String(p.price || ''),
            deliveryDays: String(p.deliveryDays || ''),
            revisions: String(p.revisions || '1'),
            description: p.description || '',
            features: Array.isArray(p.features) ? p.features.join(', ') : (p.features || ''),
          })),
        });
      } catch {
        toast.error('Could not load offer');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const setPkg = (i, key, val) => {
    const pkgs = [...form.packages];
    pkgs[i] = { ...pkgs[i], [key]: val };
    setForm({ ...form, packages: pkgs });
  };

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim()) return toast.error('Title and description are required');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        packages: form.packages.map((p) => ({
          name: p.name,
          price: parseFloat(p.price) || 0,
          deliveryDays: parseInt(p.deliveryDays, 10) || 0,
          revisions: parseInt(p.revisions, 10) || 0,
          description: p.description,
          features: String(p.features || '').split(',').map((f) => f.trim()).filter(Boolean),
        })),
      };
      if (id) await api.put(`/offers/${id}`, payload);
      else await api.post('/offers', payload);
      toast.success('Offer saved');
      navigation.goBack();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Screen header={<Header title="Edit offer" onBack={() => navigation.goBack()} />}><Loading /></Screen>;

  return (
    <Screen scroll keyboardAware header={<Header title={id ? 'Edit offer' : 'New offer'} onBack={() => navigation.goBack()} />}>
      <Card>
        <Input label="Title" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholder="I will design a modern mobile app" />
        <Textarea label="Description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} placeholder="What's included?" rows={5} />
        <Input label="Category" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} />
      </Card>

      {form.packages.map((p, i) => (
        <Card key={i} style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>{p.name} package</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="Price ($)" value={p.price} onChangeText={(v) => setPkg(i, 'price', v)} keyboardType="decimal-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Delivery (days)" value={p.deliveryDays} onChangeText={(v) => setPkg(i, 'deliveryDays', v)} keyboardType="number-pad" />
            </View>
          </View>
          <Input label="Revisions" value={p.revisions} onChangeText={(v) => setPkg(i, 'revisions', v)} keyboardType="number-pad" />
          <Textarea label="Description" value={p.description} onChangeText={(v) => setPkg(i, 'description', v)} rows={3} />
          <Input label="Features (comma separated)" value={p.features} onChangeText={(v) => setPkg(i, 'features', v)} />
        </Card>
      ))}

      <Button title="Save offer" size="lg" full loading={saving} onPress={submit} style={{ marginTop: 14 }} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  h: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12 },
});

export default EditOffer;
