import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, Header } from '../../components/ui';
import { useTheme } from '../../theme';
import BrowseJobs from './BrowseJobs';
import BrowseOffers from './BrowseOffers';
import BrowseFreelancers from './BrowseFreelancers';

const TABS = [
  { key: 'jobs', label: 'Jobs', icon: 'briefcase-outline' },
  { key: 'offers', label: 'Offers', icon: 'pricetags-outline' },
  { key: 'freelancers', label: 'Talent', icon: 'people-outline' },
];

const BrowseHub = ({ navigation }) => {
  const { colors } = useTheme();
  const [tab, setTab] = useState('jobs');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="Browse" showBack={false} />
      <View style={styles.tabsRow}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[
                styles.tab,
                { borderColor: active ? colors.primary : colors.b1, backgroundColor: active ? 'rgba(108,78,246,0.12)' : colors.s2 },
              ]}
            >
              <Ionicons name={t.icon} size={16} color={active ? colors.primary2 : colors.txt3} />
              <Text style={[styles.tabLabel, { color: active ? colors.primary2 : colors.txt2 }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flex: 1 }}>
        {tab === 'jobs' && <BrowseJobs navigation={navigation} />}
        {tab === 'offers' && <BrowseOffers navigation={navigation} />}
        {tab === 'freelancers' && <BrowseFreelancers navigation={navigation} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabLabel: { fontSize: 13, fontWeight: '700' },
});

export default BrowseHub;
