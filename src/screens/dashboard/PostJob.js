import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input, Textarea, Chip } from '../../components/ui';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const CATS = ['Web Development', 'Mobile', 'Design', 'Writing', 'Marketing', 'Data', 'AI', 'Video', 'Other'];

const PostJob = ({ navigation, route }) => {
  const { colors } = useTheme();
  const editing = route.params?.id;
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    budgetMin: '',
    budgetMax: '',
    duration: '1-4 weeks',
    skills: '',
  });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim()) return toast.error('Title and description required');
    const bmin = parseFloat(form.budgetMin) || 0;
    const bmax = parseFloat(form.budgetMax) || 0;
    if (!bmin || !bmax) return toast.error('Enter a valid budget range');
    setBusy(true);
    try {
      const payload = {
        ...form,
        budgetMin: bmin,
        budgetMax: bmax,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editing) await api.put(`/jobs/${editing}`, payload);
      else await api.post('/jobs', payload);
      toast.success('Job posted');
      navigation.goBack();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll keyboardAware header={<Header title={editing ? 'Edit job' : 'Post a job'} onBack={() => navigation.goBack()} />}>
      <Card>
        <Input label="Job title" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholder="e.g. Landing page redesign" />
        <Textarea label="Description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} placeholder="Describe the scope, goals, and deliverables…" rows={6} />

        <Text style={[styles.label, { color: colors.txt2 }]}>Category</Text>
        <View style={styles.chips}>
          {CATS.map((c) => (
            <Chip key={c} label={c} active={form.category === c} onPress={() => setForm({ ...form, category: c })} style={{ marginRight: 8, marginBottom: 8 }} />
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Input label="Budget min ($)" value={form.budgetMin} onChangeText={(v) => setForm({ ...form, budgetMin: v })} keyboardType="decimal-pad" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Budget max ($)" value={form.budgetMax} onChangeText={(v) => setForm({ ...form, budgetMax: v })} keyboardType="decimal-pad" />
          </View>
        </View>

        <Input label="Duration" value={form.duration} onChangeText={(v) => setForm({ ...form, duration: v })} placeholder="e.g. 2-4 weeks" />
        <Input label="Skills (comma separated)" value={form.skills} onChangeText={(v) => setForm({ ...form, skills: v })} placeholder="react, figma, tailwind" />
      </Card>
      <Button title={editing ? 'Save changes' : 'Publish job'} full size="lg" loading={busy} onPress={submit} style={{ marginTop: 14 }} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 0.4, marginBottom: 8, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
});

export default PostJob;
