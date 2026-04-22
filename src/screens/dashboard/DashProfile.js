import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input, Textarea, Avatar, Badge } from '../../components/ui';
import { useAuthStore } from '../../store';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const DashProfile = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    title: user?.title || '',
    bio: user?.bio || '',
    hourlyRate: String(user?.hourlyRate || ''),
    location: user?.location || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.skills || ''),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      fullName: user?.fullName || '',
      title: user?.title || '',
      bio: user?.bio || '',
      hourlyRate: String(user?.hourlyRate || ''),
      location: user?.location || '',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.skills || ''),
    });
  }, [user?._id]);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/me', {
        fullName: form.fullName,
        title: form.title,
        bio: form.bio,
        hourlyRate: parseFloat(form.hourlyRate) || 0,
        location: form.location,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      if (data?.user) updateUser(data.user);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll keyboardAware header={<Header title="My profile" onBack={() => navigation.goBack()} />}>
      <Card style={{ alignItems: 'center', paddingVertical: 22 }}>
        <Avatar size={88} name={user?.fullName} src={user?.avatarUrl} />
        <Text style={[styles.name, { color: colors.txt }]}>{user?.fullName}</Text>
        <Text style={[styles.email, { color: colors.txt3 }]}>{user?.email}</Text>
        {typeof user?.aiScore === 'number' ? (
          <Badge variant="primary" style={{ marginTop: 8 }}>AI score {user.aiScore}</Badge>
        ) : null}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Input label="Full name" value={form.fullName} onChangeText={(v) => setForm({ ...form, fullName: v })} />
        <Input label="Title / headline" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholder="e.g. Full Stack Engineer" />
        <Input label="Location" value={form.location} onChangeText={(v) => setForm({ ...form, location: v })} placeholder="City, Country" />
        <Input label="Hourly rate ($)" value={form.hourlyRate} onChangeText={(v) => setForm({ ...form, hourlyRate: v })} keyboardType="decimal-pad" />
        <Textarea label="Bio" value={form.bio} onChangeText={(v) => setForm({ ...form, bio: v })} rows={4} />
        <Input label="Skills (comma separated)" value={form.skills} onChangeText={(v) => setForm({ ...form, skills: v })} />
      </Card>

      <Button title="Save changes" full size="lg" loading={saving} onPress={save} style={{ marginTop: 14 }} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  name: { fontSize: 18, fontWeight: '800', marginTop: 10 },
  email: { fontSize: 12, marginTop: 3 },
});

export default DashProfile;
