import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Loading, EmptyState, Button } from '../../components/ui';
import { useNotifStore } from '../../store';
import { formatRelative } from '../../utils/helpers';

const ICON = {
  order: 'bag-handle-outline',
  message: 'chatbubble-outline',
  proposal: 'document-text-outline',
  review: 'star-outline',
  payment: 'card-outline',
  dispute: 'warning-outline',
  system: 'notifications-outline',
};

const Notifications = ({ navigation }) => {
  const { colors } = useTheme();
  const items = useNotifStore((s) => s.notifications);
  const isFetching = useNotifStore((s) => s.isFetching);
  const fetch = useNotifStore((s) => s.fetch);
  const markRead = useNotifStore((s) => s.markRead);
  const markAllRead = useNotifStore((s) => s.markAllRead);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetch(); }, []);

  const onPress = (n) => {
    if (!n.isRead) markRead(n._id || n.id);
    const type = n.type || '';
    if (type === 'message' && n.meta?.conversationId) {
      navigation.navigate('ChatScreen', { conversationId: n.meta.conversationId, peer: n.meta.peer });
    } else if (type === 'order' && n.meta?.orderId) {
      navigation.navigate('OrderDetail', { id: n.meta.orderId });
    } else if (type === 'proposal' && n.meta?.proposalId) {
      navigation.navigate('ViewProposal', { id: n.meta.proposalId });
    }
  };

  return (
    <Screen padded={false} header={
      <Header title="Notifications" onBack={() => navigation.goBack()}
        right={<Button title="Read all" size="xs" variant="ghost" onPress={markAllRead} />}
      />
    }>
      {isFetching && (items || []).length === 0 ? <Loading /> : (items || []).length === 0 ? (
        <EmptyState icon="notifications-outline" title="You're all caught up" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => String(n._id || n.id)}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await fetch(); setRefreshing(false); }} tintColor={colors.primary} />}
          renderItem={({ item: n }) => (
            <Pressable onPress={() => onPress(n)}>
              <Card style={[styles.card, { backgroundColor: n.isRead ? colors.s1 : 'rgba(108,78,246,0.06)', borderColor: n.isRead ? colors.b1 : colors.primary }]}>
                <View style={[styles.iconWrap, { backgroundColor: 'rgba(108,78,246,0.14)' }]}>
                  <Ionicons name={ICON[n.type] || ICON.system} size={18} color={colors.primary2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { color: colors.txt }]}>{n.title}</Text>
                  <Text style={[styles.body, { color: colors.txt2 }]} numberOfLines={2}>{n.message || n.body}</Text>
                  <Text style={[styles.time, { color: colors.txt3 }]}>{formatRelative(n.createdAt)}</Text>
                </View>
                {!n.isRead ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '800' },
  body: { fontSize: 13, lineHeight: 18, marginTop: 3 },
  time: { fontSize: 11, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
});

export default Notifications;
