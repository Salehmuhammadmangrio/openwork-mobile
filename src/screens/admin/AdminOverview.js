import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Header, Card, Loading, SectionTitle } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatCompactNumber } from '../../utils/helpers';

const AdminOverview = ({ navigation }) => {
  const { colors } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/admin/overview');
      setStats(data?.stats || data || {});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <><Header title="Admin" showBack={false} /><Loading /></>;
  const s = stats || {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Admin Console" showBack={false} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      >
        <LinearGradient colors={['#6C4EF6', '#9B6DFF']} style={styles.hero}>
          <Text style={styles.label}>GMV (all-time)</Text>
          <Text style={styles.value}>{formatCurrency(s.gmv || 0)}</Text>
          <Text style={styles.sub}>Platform fee revenue: {formatCurrency(s.feeRevenue || 0)}</Text>
        </LinearGradient>

        <View style={styles.grid}>
          <Tile colors={colors} icon="people-outline" label="Users" value={formatCompactNumber(s.users || 0)} onPress={() => navigation.navigate('AdminUsers')} />
          <Tile colors={colors} icon="briefcase-outline" label="Jobs" value={formatCompactNumber(s.jobs || 0)} onPress={() => navigation.navigate('AdminJobs')} />
          <Tile colors={colors} icon="bag-handle-outline" label="Orders" value={formatCompactNumber(s.orders || 0)} />
          <Tile colors={colors} icon="warning-outline" label="Disputes" value={formatCompactNumber(s.disputes || 0)} onPress={() => navigation.navigate('AdminDisputes')} />
          <Tile colors={colors} icon="shield-outline" label="Fraud" value={formatCompactNumber(s.fraudFlags || 0)} onPress={() => navigation.navigate('AdminFraud')} />
          <Tile colors={colors} icon="document-outline" label="Reports" value={formatCompactNumber(s.reports || 0)} onPress={() => navigation.navigate('AdminReports')} />
        </View>

        <SectionTitle title="Tools" />
        <Pressable onPress={() => navigation.navigate('AdminAIRanking')}>
          <Card style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="sparkles-outline" size={22} color={colors.primary2} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.txt, fontSize: 14, fontWeight: '800' }}>AI ranking weights</Text>
              <Text style={{ color: colors.txt3, fontSize: 12, marginTop: 2 }}>Tune the search relevance knobs.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.txt3} />
          </Card>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('AdminLogs')}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="terminal-outline" size={22} color={colors.primary2} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.txt, fontSize: 14, fontWeight: '800' }}>System logs</Text>
              <Text style={{ color: colors.txt3, fontSize: 12, marginTop: 2 }}>Recent events & errors.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.txt3} />
          </Card>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const Tile = ({ icon, label, value, colors, onPress }) => (
  <Pressable onPress={onPress} style={{ width: '48%' }} disabled={!onPress}>
    <Card style={{ padding: 14 }}>
      <Ionicons name={icon} size={18} color={colors.primary2} />
      <Text style={{ color: colors.txt, fontSize: 22, fontWeight: '900', marginTop: 8 }}>{value}</Text>
      <Text style={{ color: colors.txt3, fontSize: 11, fontWeight: '700', marginTop: 2 }}>{label.toUpperCase()}</Text>
    </Card>
  </Pressable>
);

const styles = StyleSheet.create({
  hero: { padding: 22, borderRadius: 18, marginBottom: 12 },
  label: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  value: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
});

export default AdminOverview;
