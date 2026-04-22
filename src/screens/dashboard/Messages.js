import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Header, Card, Avatar, Loading, EmptyState, Badge, Input } from '../../components/ui';
import { useChatStore, useAuthStore } from '../../store';
import { formatRelative, truncate, safeArray } from '../../utils/helpers';

const Messages = ({ navigation }) => {
  const { colors } = useTheme();
  const { conversations, loadingConversations, fetchConversations } = useChatStore();
  const user = useAuthStore((s) => s.user);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => { fetchConversations(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  }, [fetchConversations]);

  const filtered = safeArray(conversations).filter((c) => {
    if (!q.trim()) return true;
    const peers = safeArray(c.participants).filter((p) => p?._id !== user?._id);
    const name = peers[0]?.fullName || '';
    return name.toLowerCase().includes(q.toLowerCase());
  });

  const renderItem = ({ item }) => {
    const peers = safeArray(item.participants).filter((p) => p?._id !== user?._id);
    const peer = peers[0] || {};
    const last = item.lastMessage;
    return (
      <Pressable onPress={() => navigation.navigate('ChatScreen', { conversationId: item._id, peer })}>
        <View style={[styles.row, { borderBottomColor: colors.b1 }]}>
          <Avatar size={48} name={peer.fullName} src={peer.avatarUrl} />
          <View style={{ flex: 1 }}>
            <View style={styles.head}>
              <Text numberOfLines={1} style={[styles.name, { color: colors.txt }]}>
                {peer.fullName || 'Unknown'}
              </Text>
              <Text style={[styles.time, { color: colors.txt3 }]}>{formatRelative(last?.createdAt || item.updatedAt)}</Text>
            </View>
            <View style={styles.sub}>
              <Text numberOfLines={1} style={[styles.preview, { color: item.unreadCount ? colors.txt : colors.txt2 }]}>
                {truncate(last?.content || 'Start the conversation…', 70)}
              </Text>
              {item.unreadCount ? (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeTxt}>{item.unreadCount}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Messages" showBack={false} />
      <View style={{ paddingHorizontal: 16 }}>
        <Input
          placeholder="Search conversations…"
          value={q}
          onChangeText={setQ}
          leftIcon={<Ionicons name="search" size={18} color={colors.txt3} />}
        />
      </View>
      {loadingConversations ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="No conversations yet"
          description="Start chatting with freelancers or clients directly from their profile."
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, alignItems: 'center' },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '800', flex: 1, paddingRight: 10 },
  time: { fontSize: 11 },
  sub: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, gap: 8 },
  preview: { fontSize: 13, flex: 1 },
  badge: { minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
});

export default Messages;
