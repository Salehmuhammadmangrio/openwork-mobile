import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header } from '../../components/ui';
import { useTheme } from '../../theme';

const SECTIONS = [
  {
    h: '1. Information We Collect',
    p: 'We collect account data (name, email, role), activity data (jobs, proposals, messages), and payment data processed securely by Stripe. Device and usage data is used to improve reliability and prevent abuse.',
  },
  {
    h: '2. How We Use Data',
    p: 'We use your information to match you with opportunities, power AI skill scoring, deliver escrow payments, provide notifications, and keep the platform safe.',
  },
  {
    h: '3. Sharing',
    p: 'We never sell your personal data. We share information only with service providers (e.g. Stripe, Firebase), when legally required, or to enforce our terms.',
  },
  {
    h: '4. Your Rights',
    p: 'You can access, update, or delete your account data at any time from Settings. Contact support@openwork.com for assistance.',
  },
  {
    h: '5. Security',
    p: 'We use TLS encryption in transit, hashed credentials, token-based sessions, and strict access controls. No system is perfectly secure, so we encourage strong passwords and 2FA.',
  },
  {
    h: '6. Children',
    p: 'OpenWork is not intended for children under 16.',
  },
  {
    h: '7. Updates',
    p: 'We will post changes here and notify you in-app. Continued use after changes means you accept the updated policy.',
  },
];

const PrivacyPolicy = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Screen scroll header={<Header title="Privacy Policy" onBack={() => navigation.goBack()} />}>
      <Text style={[styles.sub, { color: colors.txt3 }]}>Last updated: {new Date().toLocaleDateString()}</Text>
      {SECTIONS.map((s) => (
        <View key={s.h} style={{ marginTop: 18 }}>
          <Text style={[styles.h, { color: colors.txt }]}>{s.h}</Text>
          <Text style={[styles.p, { color: colors.txt2 }]}>{s.p}</Text>
        </View>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  sub: { fontSize: 12, marginTop: 4 },
  h: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  p: { fontSize: 14, lineHeight: 22 },
});

export default PrivacyPolicy;
