import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useNotifStore, useChatStore } from '../store';

import DashboardOverview from '../screens/dashboard/Overview';
import BrowseHub from '../screens/browse/BrowseHub';
import Messages from '../screens/dashboard/Messages';
import AIAssistant from '../screens/ai/AIAssistant';
import ProfileHub from '../screens/dashboard/ProfileHub';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { colors } = useTheme();
  const unread = useNotifStore((s) => s.unreadCount);
  const convs = useChatStore((s) => s.conversations);
  const unreadMsg = convs.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg2,
          borderTopColor: colors.b1,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarActiveTintColor: colors.primary2,
        tabBarInactiveTintColor: colors.txt3,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, focused, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Browse: focused ? 'search' : 'search-outline',
            Messages: focused ? 'chatbubbles' : 'chatbubbles-outline',
            AI: focused ? 'sparkles' : 'sparkles-outline',
            Profile: focused ? 'person-circle' : 'person-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardOverview} />
      <Tab.Screen name="Browse" component={BrowseHub} />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{ tabBarBadge: unreadMsg > 0 ? unreadMsg : undefined }}
      />
      <Tab.Screen name="AI" component={AIAssistant} options={{ title: 'AI' }} />
      <Tab.Screen
        name="Profile"
        component={ProfileHub}
        options={{ tabBarBadge: unread > 0 ? unread : undefined }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
