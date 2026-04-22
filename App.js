import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import ToastHost from './src/components/ui/ToastHost';
import { useAuthStore, useNotifStore, useChatStore } from './src/store';
import { connectSocket, disconnectSocket, getSocket } from './src/utils/socket';
import { useThemeStore } from './src/store/themeStore';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Require cycle',
]);

const AppBootstrap = ({ children }) => {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const fetchNotifs = useNotifStore((s) => s.fetch);
  const addNotif = useNotifStore((s) => s.addNew);
  const fetchConvs = useChatStore((s) => s.fetchConversations);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateUnread = useChatStore((s) => s.updateConversationUnreadCount);

  useEffect(() => {
    if (!isAuth || !user?._id) return;
    refreshProfile?.();
    fetchNotifs?.();
    fetchConvs?.();
    const s = connectSocket(user._id);
    const onNotification = (n) => addNotif?.(n);
    const onMessage = ({ conversationId, message }) => {
      if (!conversationId || !message) return;
      addMessage(conversationId, message);
    };
    const onUnread = ({ conversationId, unreadCount }) => {
      if (conversationId) updateUnread(conversationId, unreadCount || 0);
    };
    s.on('notification:new', onNotification);
    s.on('message:new', onMessage);
    s.on('conversation:unread', onUnread);
    return () => {
      s.off('notification:new', onNotification);
      s.off('message:new', onMessage);
      s.off('conversation:unread', onUnread);
    };
  }, [isAuth, user?._id]);

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  return children;
};

export default function App() {
  const mode = useThemeStore((s) => s.mode);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppBootstrap>
          <View style={{ flex: 1 }}>
            <RootNavigator />
            <ToastHost />
          </View>
        </AppBootstrap>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
