import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Button, Avatar, SectionTitle } from '../../components/ui';
import api from '../../utils/api';
import { useAuthStore, useThemeStore } from '../../store';
import { formatCurrency, formatRelative, safeArray } from '../../utils/helpers';

const Overview = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const mode = useThemeStore((s) => s.mode);

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, orders, jobs] = await Promise.all([
        api.get('/dashboard/stats').catch(() => ({ data: {} })),
        api.get('/orders', { params: { limit: 3 } }).catch(() => ({ data: {} })),
        activeRole === 'freelancer'
          ? api.get('/jobs', { params: { limit: 3 } }).catch(() => ({ data: {} }))
          : Promise.resolve({ data: {} }),
      ]);
      setStats(s.data?.stats || s.data || {});
      setRecentOrders(safeArray(orders.data?.orders));
      setRecentJobs(safeArray(jobs.data?.jobs));
    } finally {
      setRefreshing(false);
    }
  }, [activeRole]);

  useEffect(() => { load(); }, [load]);

  const isFreelancer = activeRole === 'freelancer';
  const isAdmin = user?.role === 'admin';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header
        showBack={false}
        title={`Hi, ${user?.fullName?.split(' ')[0] || 'there'}`}
        subtitle={isFreelancer ? 'Your freelance HQ' : 'Your client dashboard'}
        right={
          <Pressable onPress={toggleTheme} hitSlop={10}>
            <Ionicons name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={22} color={colors.txt2} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      >
        <LinearGradient colors={['#6C4EF6', '#9B6DFF']} style={styles.hero}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroL}>Total {isFreelancer ? 'earnings' : 'spend'}</Text>
              <Text style={styles.heroN}>
                {formatCurrency((isFreelancer ? stats?.totalEarnings : stats?.totalSpend) || 0)}
              </Text>
              <Text style={styles.heroM}>
                {isFreelancer ? `${stats?.completedOrders || 0} completed orders` : `${stats?.activeOrders || 0} active orders`}
              </Text>
            </View>
            <Ionicons name={isFreelancer ? 'trending-up' : 'briefcase'} size={52} color="rgba(255,255,255,0.2)" />
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          <StatCard
            colors={colors}
            icon="trending-up"
            label={isFreelancer ? 'Active orders' : 'Active orders'}
            value={stats?.activeOrders || 0}
            onPress={() => navigation.navigate('Orders')}
          />
          <StatCard
            colors={colors}
            icon="star-outline"
            label="Rating"
            value={(stats?.rating || 0).toFixed(1)}
            onPress={() => navigation.navigate('Reviews')}
          />
          <StatCard
            colors={colors}
            icon="document-text-outline"
            label={isFreelancer ? 'Proposals' : 'Jobs'}
            value={isFreelancer ? (stats?.totalProposals || 0) : (stats?.totalJobs || 0)}
            onPress={() => navigation.navigate(isFreelancer ? 'Proposals' : 'MyJobs')}
          />
        </View>

        <SectionTitle title="Quick actions" />
        <View style={styles.actionsGrid}>
          {isFreelancer ? (
            <>
              <QA colors={colors} icon="search" label="Find jobs" onPress={() => navigation.navigate('Browse')} />
              <QA colors={colors} icon="pricetag" label="My offers" onPress={() => navigation.navigate('MyOffers')} />
              <QA colors={colors} icon="bar-chart" label="Analytics" onPress={() => navigation.navigate('Analytics')} />
              <QA colors={colors} icon="school" label="Skill tests" onPress={() => navigation.navigate('SkillTests')} />
            </>
          ) : (
            <>
              <QA colors={colors} icon="add-circle" label="Post a job" onPress={() => navigation.navigate('PostJob')} />
              <QA colors={colors} icon="people" label="Find talent" onPress={() => navigation.navigate('Browse')} />
              <QA colors={colors} icon="document-text" label="My jobs" onPress={() => navigation.navigate('MyJobs')} />
              <QA colors={colors} icon="card" label="Payments" onPress={() => navigation.navigate('Payments')} />
            </>
          )}
        </View>

        {isAdmin ? (
          <Button title="Open admin console" variant="secondary" full style={{ marginTop: 12 }} onPress={() => navigation.navigate('Admin')} />
        ) : null}

        <SectionTitle title="Recent orders" actionLabel="See all" onAction={() => navigation.navigate('Orders')} />
        {recentOrders.length === 0 ? (
          <Card><Text style={{ color: colors.txt3, fontSize: 13, textAlign: 'center' }}>No orders yet</Text></Card>
        ) : (
          recentOrders.slice(0, 3).map((o) => (
            <Card key={o._id} style={{ marginBottom: 10 }} onPress={() => navigation.navigate('OrderDetail', { id: o._id })}>
              <View style={styles.rowBetween}>
                <Text numberOfLines={1} style={[styles.itemTitle, { color: colors.txt }]}>{o.title}</Text>
                <Badge variant={o.status === 'completed' ? 'success' : o.status === 'delivered' ? 'info' : 'neutral'}>
                  {(o.status || 'new').toUpperCase()}
                </Badge>
              </View>
              <View style={styles.rowBetween}>
                <Text style={[styles.meta, { color: colors.txt3 }]}>{formatRelative(o.createdAt)}</Text>
                <Text style={[styles.amount, { color: colors.ok }]}>{formatCurrency(o.totalAmount || 0)}</Text>
              </View>
            </Card>
          ))
        )}

        {isFreelancer && recentJobs.length > 0 ? (
          <>
            <SectionTitle title="New for you" actionLabel="Browse" onAction={() => navigation.navigate('Browse')} />
            {recentJobs.map((j) => (
              <Card key={j._id} style={{ marginBottom: 10 }} onPress={() => navigation.navigate('JobDetail', { id: j._id })}>
                <Text numberOfLines={1} style={[styles.itemTitle, { color: colors.txt }]}>{j.title}</Text>
                <Text style={[styles.meta, { color: colors.txt3 }]}>
                  {j.category || 'General'} · {formatRelative(j.createdAt)}
                </Text>
                <Text style={[styles.amount, { color: colors.ok, marginTop: 6 }]}>
                  {formatCurrency(j.budgetMin || 0)} – {formatCurrency(j.budgetMax || 0)}
                </Text>
              </Card>
            ))}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

const StatCard = ({ icon, label, value, colors, onPress }) => (
  <Pressable onPress={onPress} style={{ flex: 1 }}>
    <Card style={{ padding: 12, alignItems: 'flex-start' }}>
      <Ionicons name={icon} size={18} color={colors.primary2} />
      <Text style={{ color: colors.txt, fontSize: 20, fontWeight: '800', marginTop: 6 }}>{value}</Text>
      <Text style={{ color: colors.txt3, fontSize: 11, fontWeight: '600', marginTop: 2 }}>{label}</Text>
    </Card>
  </Pressable>
);

const QA = ({ icon, label, colors, onPress }) => (
  <Pressable onPress={onPress} style={{ width: '48%' }}>
    <Card style={{ padding: 14 }}>
      <View style={[styles.qaIcon, { backgroundColor: 'rgba(108,78,246,0.14)' }]}>
        <Ionicons name={icon} size={20} color={colors.primary2} />
      </View>
      <Text style={{ color: colors.txt, fontWeight: '800', fontSize: 14, marginTop: 10 }}>{label}</Text>
    </Card>
  </Pressable>
);

const styles = StyleSheet.create({
  hero: { borderRadius: 18, padding: 18, marginBottom: 14 },
  heroL: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  heroN: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 4 },
  heroM: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  qaIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  itemTitle: { fontSize: 14, fontWeight: '800', flex: 1, paddingRight: 8 },
  meta: { fontSize: 11 },
  amount: { fontSize: 13, fontWeight: '800' },
});

export default Overview;
