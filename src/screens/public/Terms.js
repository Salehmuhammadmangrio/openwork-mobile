import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header } from '../../components/ui';
import { useTheme } from '../../theme';

const SECTIONS = [
  { h: '1. Acceptance of Terms', p: 'By creating an account, you agree to these Terms. If you don\'t agree, don\'t use OpenWork.' },
  { h: '2. Accounts', p: 'You are responsible for your account, including keeping credentials safe and ensuring your information is accurate.' },
  { h: '3. Fees', p: 'OpenWork charges service fees on completed orders and withdrawals as described in Payments. Fees may change with notice.' },
  { h: '4. Escrow', p: 'Clients fund milestones up-front. Funds are released to freelancers on approval or automatically after the review window.' },
  { h: '5. Prohibited Conduct', p: 'Fraud, harassment, intellectual property theft, off-platform payment, and attempts to undermine platform safety are strictly prohibited.' },
  { h: '6. Disputes', p: 'Disputes are resolved through in-platform dispute resolution. OpenWork\'s decision is final.' },
  { h: '7. Termination', p: 'We may suspend or terminate accounts that violate these Terms. You may delete your account at any time.' },
  { h: '8. Disclaimer', p: 'OpenWork is provided "as is" without warranties. We are not liable for indirect damages.' },
];

const Terms = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Screen scroll header={<Header title="Terms of Service" onBack={() => navigation.goBack()} />}>
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

export default Terms;
