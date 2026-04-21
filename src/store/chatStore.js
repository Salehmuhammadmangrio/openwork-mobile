import { create } from 'zustand';
import api from '../utils/api';

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingStates: {},
  loadingConversations: false,
  loadingMessages: false,

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const { data } = await api.get('/messages/conversations');
      set({ conversations: data.conversations || [] });
    } catch {
      set({ conversations: [] });
    } finally {
      set({ loadingConversations: false });
    }
  },

  setActive: (id) => set({ activeConversationId: id }),

  fetchMessages: async (conversationId) => {
    set({ loadingMessages: true });
    try {
      const { data } = await api.get(
        `/messages/conversations/${conversationId}/messages`
      );
      set((s) => ({
        messages: {
          ...s.messages,
          [conversationId]: data.messages || [],
        },
      }));
      return data.messages || [];
    } catch {
      return [];
    } finally {
      set({ loadingMessages: false });
    }
  },

  addMessage: (conversationId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: [...(s.messages[conversationId] || []), message],
      },
    })),

  markMessagesAsRead: (conversationId, seenBy, seenAt) =>
    set((s) => {
      const msgs = s.messages[conversationId] || [];
      return {
        messages: {
          ...s.messages,
          [conversationId]: msgs.map((m) =>
            m.sender?._id !== seenBy && !m.readAt ? { ...m, readAt: seenAt } : m
          ),
        },
      };
    }),

  updateConversationUnreadCount: (conversationId, newCount) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: newCount } : c
      ),
    })),

  setTyping: (conversationId, userId, isTyping) =>
    set((s) => ({
      typingStates: {
        ...s.typingStates,
        [conversationId]: {
          ...(s.typingStates[conversationId] || {}),
          [userId]: isTyping,
        },
      },
    })),

  sendMessage: async (conversationId, content, attachments = []) => {
    const { data } = await api.post(
      `/messages/conversations/${conversationId}/messages`,
      { content, attachments }
    );
    const msg = data?.message;
    if (msg) get().addMessage(conversationId, msg);
    return msg;
  },

  startConversation: async (recipientId) => {
    const { data } = await api.post('/messages/conversations', { recipientId });
    const conv = data?.conversation;
    if (conv) {
      set((s) => ({
        conversations: [conv, ...s.conversations.filter((c) => c._id !== conv._id)],
      }));
    }
    return conv;
  },
}));
