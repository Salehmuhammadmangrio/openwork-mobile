import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Header, Card, Loading, EmptyState } from '../../components/ui';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const suggestions = [
  'Help me write a proposal for a landing page project',
  'What are freelance rates for senior react devs?',
  'Draft a gig description for logo design',
  'Explain escrow to my client',
];

const AIAssistant = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef();

  const send = async (text) => {
    const value = (text || input).trim();
    if (!value || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: value };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: value, history: messages.slice(-10) });
      const reply = data?.reply || data?.message || 'Sorry, I could not generate a response.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="AI Assistant" showBack={false} />
      {messages.length === 0 ? (
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <LinearGradient colors={['#6C4EF6', '#9B6DFF']} style={styles.hero}>
            <Ionicons name="sparkles" size={36} color="#fff" />
            <Text style={styles.heroTitle}>Your AI co-pilot</Text>
            <Text style={styles.heroSub}>Draft proposals, summarize messages, get pricing ideas, and more.</Text>
          </LinearGradient>
          <Text style={[styles.h, { color: colors.txt2 }]}>TRY ASKING</Text>
          {suggestions.map((s, i) => (
            <Pressable key={i} onPress={() => send(s)}>
              <Card style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="arrow-forward-circle-outline" size={18} color={colors.primary2} />
                <Text style={{ color: colors.txt, fontSize: 13, flex: 1 }}>{s}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 14, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={[styles.msg, item.role === 'user' && { alignItems: 'flex-end' }]}>
              <View style={[styles.bubble, { backgroundColor: item.role === 'user' ? colors.primary : colors.s2 }]}>
                <Text style={{ color: item.role === 'user' ? '#fff' : colors.txt, fontSize: 14, lineHeight: 21 }}>
                  {item.content}
                </Text>
              </View>
            </View>
          )}
          ListFooterComponent={loading ? <View style={{ padding: 12 }}><Loading text="Thinking…" size="small" /></View> : null}
        />
      )}
      <View style={[styles.inputRow, { borderTopColor: colors.b1 }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything…"
          placeholderTextColor={colors.txt3}
          style={[styles.input, { backgroundColor: colors.s2, color: colors.txt }]}
          multiline
        />
        <Pressable
          onPress={() => send()}
          style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.primary : colors.s2 }]}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  hero: { padding: 22, borderRadius: 18, alignItems: 'center', marginBottom: 16 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 10 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  h: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  msg: { marginBottom: 8 },
  bubble: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, maxWidth: '82%' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1 },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22, fontSize: 14, maxHeight: 120 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});

export default AIAssistant;
