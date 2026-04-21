import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Header, Loading, EmptyState, Avatar } from '../../components/ui';
import { useChatStore, useAuthStore } from '../../store';
import { formatRelative } from '../../utils/helpers';
import { connectSocket, getSocket } from '../../utils/socket';
import { toast } from '../../utils/toast';

const ChatScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { conversationId, peer } = route.params || {};
  const user = useAuthStore((s) => s.user);
  const messagesMap = useChatStore((s) => s.messages);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const addMessage = useChatStore((s) => s.addMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const setActive = useChatStore((s) => s.setActive);

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const messages = messagesMap[conversationId] || [];

  useEffect(() => {
    setActive(conversationId);
    (async () => {
      await fetchMessages(conversationId);
      setLoading(false);
    })();

    const socket = connectSocket(user?._id);
    socket.emit('conversation:join', { conversationId });

    const onNew = (msg) => {
      if (msg?.conversation === conversationId || msg?.conversationId === conversationId) {
        addMessage(conversationId, msg);
      }
    };
    const onTyping = ({ conversationId: cid, userId, isTyping }) => {
      if (cid === conversationId) setTyping(cid, userId, isTyping);
    };

    socket.on('message:new', onNew);
    socket.on('typing', onTyping);

    return () => {
      socket.off('message:new', onNew);
      socket.off('typing', onTyping);
      socket.emit('conversation:leave', { conversationId });
      setActive(null);
    };
  }, [conversationId]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(conversationId, text.trim());
      setText('');
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      toast.error('Failed to send');
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const mine = item.sender?._id === user?._id || item.sender === user?._id;
    const prev = messages[index - 1];
    const showAvatar = !mine && (!prev || (prev.sender?._id !== item.sender?._id && prev.sender !== item.sender));
    return (
      <View style={[styles.msgRow, mine && styles.msgRowMine]}>
        {!mine ? (
          showAvatar ? (
            <Avatar size={26} name={item.sender?.fullName || peer?.fullName} src={item.sender?.avatarUrl || peer?.avatarUrl} />
          ) : (
            <View style={{ width: 26 }} />
          )
        ) : null}
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: mine ? colors.primary : colors.s2,
              borderBottomRightRadius: mine ? 4 : 14,
              borderBottomLeftRadius: mine ? 14 : 4,
              marginLeft: mine ? 40 : 6,
              marginRight: mine ? 6 : 40,
            },
          ]}
        >
          <Text style={{ color: mine ? '#fff' : colors.txt, fontSize: 14, lineHeight: 20 }}>{item.content}</Text>
          <Text style={{ color: mine ? 'rgba(255,255,255,0.7)' : colors.txt3, fontSize: 10, marginTop: 4 }}>
            {formatRelative(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Header
        title={peer?.fullName || 'Chat'}
        subtitle={peer?.title}
        onBack={() => navigation.goBack()}
      />
      {loading ? (
        <Loading />
      ) : messages.length === 0 ? (
        <EmptyState icon="chatbubbles-outline" title="Start the conversation" description="Send your first message below." />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m._id || String(m.createdAt)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10, paddingTop: 14 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
      )}
      <View style={[styles.inputRow, { borderTopColor: colors.b1, backgroundColor: colors.bg }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message…"
          placeholderTextColor={colors.txt3}
          style={[styles.input, { backgroundColor: colors.s2, color: colors.txt }]}
          multiline
        />
        <Pressable
          onPress={send}
          style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.s2, opacity: sending ? 0.6 : 1 }]}
          disabled={!text.trim() || sending}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  msgRow: { flexDirection: 'row', gap: 4, marginBottom: 6, alignItems: 'flex-end' },
  msgRowMine: { justifyContent: 'flex-end' },
  bubble: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, maxWidth: '78%' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1 },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22, fontSize: 14, maxHeight: 120 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});

export default ChatScreen;
