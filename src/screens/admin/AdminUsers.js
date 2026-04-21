import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable, Alert as RNAlert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Input, Avatar, Chip, Button } from '../../components/ui';
import api from '../../utils/api';
import { safeArray, formatRelative } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const ROLES = ['all', 'freelancer', 'client', 'admin'];

const AdminUsers = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('all');

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const params = {};
      if (q.trim()) params.search = q.trim();
      if (role !== 'all') params.role = role;
      const { data } = await api.get('/admin/users', { params });
      setItems(safeArray(data?.users));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [q, role]);

  useEffect(() => { load(); }, [load]);

  const toggleSuspend = (u) => {
    RNAlert.alert(u.suspended ? 'Unsuspend user?' : 'Suspend user?', u.email, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: u.suspended ? 'Unsuspend' : 'Suspend',
        style: u.suspended ? 'default' : 'destructive',
        onPress: async () => {
          try {
            await api.put(`/admin/users/${u._id}/${u.suspended ? 'unsuspend' : 'suspend'}`);
            toast.success('Updated');
            load(false);
          } catch (e) {
            toast.error(e?.response?.data?.message || 'Failed');
          }
        },
      },
    ]);
  };

  return (
    <Screen padded={false} header={<Header title="Users" onBack={() => navigation.goBack()} />}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Input placeholder="Search name or email" value={q} onChangeText={setQ} leftIcon={<Ionicons name="search" size={18} color={colors.txt3} />} />
        <FlatList
          horizontal
          data={ROLES}
          keyExtractor={(r) => r}
          renderItem={({ item }) => <Chip label={item === 'all' ? 'All' : item} active={role === item} onPress={() => setRole(item)} style={{ marginRight: 8 }} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState icon="people-outline" title="No users" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(u) => u._id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: u }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Avatar size={40} name={u.fullName} src={u.avatarUrl} />
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text numberOfLines={1} style={[styles.name, { color: colors.txt }]}>{u.fullName}</Text>
                    <Badge variant={u.suspended ? 'danger' : u.role === 'admin' ? 'warning' : 'neutral'}>
                      {u.suspended ? 'SUSPENDED' : (u.role || 'USER').toUpperCase()}
                    </Badge>
                  </View>
                  <Text numberOfLines={1} style={[styles.email, { color: colors.txt3 }]}>{u.email}</Text>
                  <Text style={[styles.meta, { color: colors.txt3 }]}>Joined {formatRelative(u.createdAt)}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button title={u.suspended ? 'Unsuspend' : 'Suspend'} variant={u.suspended ? 'ghost' : 'danger'} size="sm" onPress={() => toggleSuspend(u)} style={{ flex: 1 }} full />
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  name: { fontSize: 14, fontWeight: '800', flex: 1 },
  email: { fontSize: 12, marginTop: 3 },
  meta: { fontSize: 11, marginTop: 3 },
});

export default AdminUsers;
