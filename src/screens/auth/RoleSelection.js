import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button } from '../../components/ui';
import { useAuthStore } from '../../store';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const RoleSelection = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);
  const [role, setRole] = useState(user?.role || 'freelancer');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    try {
      setLoading(true);
      const { data } = await api.patch('/auth/role', { role });
      if (data?.user) updateUser(data.user);
      setActiveRole(role === 'client' ? 'client' : 'freelancer');
      toast.success('Role updated');
      navigation.goBack();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Could not update role');
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { key: 'freelancer', icon: 'laptop-outline', title: 'Freelancer', desc: 'Find jobs, send proposals, get paid.' },
    { key: 'client', icon: 'briefcase-outline', title: 'Client', desc: 'Post jobs and hire verified talent.' },
    { key: 'both', icon: 'sync-outline', title: 'Both', desc: 'Switch roles anytime from your profile.' },
  ];

  return (
    <Screen scroll header={<Header title="Choose your role" onBack={() => navigation.goBack()} />}>
      <Text style={[styles.p, { color: colors.txt2 }]}>You can always change this later.</Text>
      {options.map((o) => (
        <Pressable key={o.key} onPress={() => setRole(o.key)}>
          <Card
            style={[
              styles.opt,
              role === o.key && { borderColor: colors.primary, backgroundColor: 'rgba(108,78,246,0.07)' },
            ]}
          >
            <LinearGradient
              colors={['#6C4EF6', '#9B6DFF']}
              style={styles.icon}
            >
              <Ionicons name={o.icon} size={20} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.txt }]}>{o.title}</Text>
              <Text style={[styles.desc, { color: colors.txt2 }]}>{o.desc}</Text>
            </View>
            {role === o.key ? (
              <Ionicons name="checkmark-circle" size={22} color={colors.primary2} />
            ) : (
              <Ionicons name="radio-button-off" size={22} color={colors.txt3} />
            )}
          </Card>
        </Pressable>
      ))}
      <Button title="Save role" full size="lg" loading={loading} onPress={save} style={{ marginTop: 14 }} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  p: { fontSize: 14, marginBottom: 14, lineHeight: 21 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  icon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '800' },
  desc: { fontSize: 12, marginTop: 4, lineHeight: 17 },
});

export default RoleSelection;
