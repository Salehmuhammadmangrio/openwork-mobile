import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert as RNAlert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Card, Badge, Header, Avatar, Divider } from '../../components/ui';
import { useAuthStore, useThemeStore } from '../../store';
import { formatCurrency } from '../../utils/helpers';

const Row = ({ icon, label, right, onPress, colors, danger }) => (
  <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: colors.b1 }]}>
    <View style={[styles.rowIcon, { backgroundColor: danger ? 'rgba(255,77,106,0.14)' : 'rgba(108,78,246,0.14)' }]}>
      <Ionicons name={icon} size={17} color={danger ? colors.err : colors.primary2} />
    </View>
    <Text style={[styles.rowLbl, { color: danger ? colors.err : colors.txt }]}>{label}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {right}
      <Ionicons name="chevron-forward" size={18} color={colors.txt3} />
    </View>
  </Pressable>
);

const ProfileHub = ({ navigation }) => {
  const { colors, mode } = useTheme();
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const toggleRole = useAuthStore((s) => s.toggleRole);
  const logout = useAuthStore((s) => s.logout);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const canClient = user?.role === 'client' || user?.canActAsClient;
  const canFreelancer = user?.role === 'freelancer' || user?.canActAsFreelancer || user?.role === 'admin';
  const bothRoles = canClient && canFreelancer;

  const confirmLogout = () => {
    RNAlert.alert('Sign out?', 'You can sign back in at any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Profile" showBack={false} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <LinearGradient colors={['#6C4EF6', '#9B6DFF']} style={styles.hero}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Avatar size={62} name={user?.fullName || 'U'} src={user?.avatarUrl} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user?.fullName || 'User'}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                <Badge variant="neutral" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} textStyle={{ color: '#fff' }}>
                  {activeRole?.toUpperCase() || 'USER'}
                </Badge>
                {user?.role === 'admin' ? (
                  <Badge variant="warning">ADMIN</Badge>
                ) : null}
              </View>
            </View>
          </View>
        </LinearGradient>

        <Card style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
          <Row colors={colors} icon="person-circle-outline" label="View & edit profile" onPress={() => navigation.navigate('DashProfile')} />
          <Row colors={colors} icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate('Notifications')} />
          <Row colors={colors} icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
          {bothRoles ? (
            <Row colors={colors} icon="sync-outline" label={`Switch to ${activeRole === 'client' ? 'Freelancer' : 'Client'}`} onPress={toggleRole} />
          ) : null}
        </Card>

        <Text style={[styles.h, { color: colors.txt2 }]}>MARKETPLACE</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Row colors={colors} icon="bag-handle-outline" label="Orders" onPress={() => navigation.navigate('Orders')} />
          {activeRole === 'freelancer' ? (
            <>
              <Row colors={colors} icon="document-text-outline" label="My proposals" onPress={() => navigation.navigate('Proposals')} />
              <Row colors={colors} icon="pricetag-outline" label="My offers" onPress={() => navigation.navigate('MyOffers')} />
              <Row colors={colors} icon="school-outline" label="Skill tests" onPress={() => navigation.navigate('SkillTests')} />
            </>
          ) : (
            <>
              <Row colors={colors} icon="briefcase-outline" label="My jobs" onPress={() => navigation.navigate('MyJobs')} />
              <Row colors={colors} icon="albums-outline" label="Received proposals" onPress={() => navigation.navigate('ReceivedProposals')} />
            </>
          )}
          <Row colors={colors} icon="star-outline" label="Reviews" onPress={() => navigation.navigate('Reviews')} />
          <Row colors={colors} icon="warning-outline" label="Disputes" onPress={() => navigation.navigate('Disputes')} />
        </Card>

        <Text style={[styles.h, { color: colors.txt2 }]}>INSIGHTS</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Row colors={colors} icon="bar-chart-outline" label="Analytics" onPress={() => navigation.navigate('Analytics')} />
          <Row colors={colors} icon="card-outline" label="Payments & wallet" onPress={() => navigation.navigate('Payments')} />
        </Card>

        {user?.role === 'admin' ? (
          <>
            <Text style={[styles.h, { color: colors.txt2 }]}>ADMIN</Text>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <Row colors={colors} icon="shield-checkmark-outline" label="Admin console" onPress={() => navigation.navigate('Admin')} />
            </Card>
          </>
        ) : null}

        <Text style={[styles.h, { color: colors.txt2 }]}>APP</Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Row colors={colors} icon={mode === 'dark' ? 'sunny-outline' : 'moon-outline'} label={mode === 'dark' ? 'Switch to light' : 'Switch to dark'} onPress={toggleTheme} />
          <Row colors={colors} icon="log-out-outline" label="Sign out" danger onPress={confirmLogout} />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: { padding: 18, borderRadius: 18 },
  name: { color: '#fff', fontSize: 18, fontWeight: '800' },
  email: { color: 'rgba(255,255,255,0.82)', fontSize: 12, marginTop: 4 },
  h: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginTop: 22, marginBottom: 10, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14, borderBottomWidth: 1 },
  rowIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  rowLbl: { flex: 1, fontSize: 14, fontWeight: '600' },
});

export default ProfileHub;
