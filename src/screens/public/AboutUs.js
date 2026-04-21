import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Card, Badge } from '../../components/ui';
import { useTheme } from '../../theme';

const VALUES = [
  { icon: 'flash-outline', title: 'Ship fast', desc: 'We prioritize shipping useful tools over polishing in the dark.' },
  { icon: 'shield-checkmark-outline', title: 'Earn trust', desc: 'Transparent fees, escrow, and AI scoring you can verify.' },
  { icon: 'heart-outline', title: 'People first', desc: 'Freelancers and clients thrive when we treat them like family.' },
  { icon: 'rocket-outline', title: 'Raise the bar', desc: 'We relentlessly improve match quality, payouts, and UX.' },
];

const AboutUs = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Screen scroll header={<Header title="About OpenWork" onBack={() => navigation.goBack()} />}>
      <Badge variant="primary" style={{ marginTop: 4 }}>ABOUT US</Badge>
      <Text style={[styles.title, { color: colors.txt }]}>
        Connecting talent with opportunity, powered by AI
      </Text>
      <Text style={[styles.body, { color: colors.txt2 }]}>
        OpenWork is a next-generation freelance platform built around verified AI skill scores,
        milestone-based escrow, and real-time collaboration. We believe talented people deserve
        better tools — and clients deserve measurable proof of what they're paying for.
      </Text>

      <Text style={[styles.h2, { color: colors.txt }]}>Our values</Text>
      {VALUES.map((v) => (
        <Card key={v.title} style={styles.valCard}>
          <View style={[styles.icon, { backgroundColor: 'rgba(108,78,246,0.14)' }]}>
            <Ionicons name={v.icon} size={18} color={colors.primary2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.vTitle, { color: colors.txt }]}>{v.title}</Text>
            <Text style={[styles.vDesc, { color: colors.txt2 }]}>{v.desc}</Text>
          </View>
        </Card>
      ))}

      <Text style={[styles.h2, { color: colors.txt }]}>Our mission</Text>
      <Text style={[styles.body, { color: colors.txt2 }]}>
        To make freelancing predictable — fair matching, fair pay, and zero guesswork.
        Work should be about the work, not fighting the platform.
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginTop: 16, letterSpacing: -0.5 },
  body: { fontSize: 14, lineHeight: 22, marginTop: 12 },
  h2: { fontSize: 18, fontWeight: '800', marginTop: 26, marginBottom: 10 },
  valCard: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  icon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  vTitle: { fontSize: 15, fontWeight: '800' },
  vDesc: { fontSize: 13, lineHeight: 19, marginTop: 4 },
});

export default AboutUs;
