import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Card, Badge } from '../../components/ui';
import { useTheme } from '../../theme';

const PILLARS = [
  { icon: 'lock-closed-outline', title: 'TLS everywhere', desc: 'All traffic is encrypted in transit with modern TLS.' },
  { icon: 'key-outline', title: 'Hashed credentials', desc: 'Passwords are hashed with a strong algorithm — never stored in plaintext.' },
  { icon: 'shield-checkmark-outline', title: 'Token-based sessions', desc: 'Short-lived JWTs with automatic session-expiry handling.' },
  { icon: 'card-outline', title: 'Secure payments', desc: 'Payments are processed by Stripe. OpenWork never stores card data.' },
  { icon: 'bug-outline', title: 'Responsible disclosure', desc: 'Report security issues to security@openwork.com. We respond within 72 hours.' },
];

const Security = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Screen scroll header={<Header title="Security" onBack={() => navigation.goBack()} />}>
      <Badge variant="success">TRUSTED BY THOUSANDS</Badge>
      <Text style={[styles.title, { color: colors.txt }]}>Security at OpenWork</Text>
      <Text style={[styles.body, { color: colors.txt2 }]}>
        We treat your data and money like our own. Here's how.
      </Text>

      {PILLARS.map((p) => (
        <Card key={p.title} style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(0,229,160,0.14)' }]}>
            <Ionicons name={p.icon} size={20} color={colors.ok} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.h, { color: colors.txt }]}>{p.title}</Text>
            <Text style={[styles.p, { color: colors.txt2 }]}>{p.desc}</Text>
          </View>
        </Card>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginTop: 14, letterSpacing: -0.5 },
  body: { fontSize: 14, lineHeight: 21, marginTop: 10, marginBottom: 18 },
  card: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  h: { fontSize: 15, fontWeight: '800' },
  p: { fontSize: 13, lineHeight: 19, marginTop: 4 },
});

export default Security;
