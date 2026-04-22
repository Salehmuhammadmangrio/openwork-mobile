import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Card, Badge, Button } from '../../components/ui';
import { useTheme } from '../../theme';

const JOBS = [
  { role: 'Senior React Native Engineer', team: 'Mobile · Remote', type: 'Full-time' },
  { role: 'AI/ML Engineer', team: 'Platform · Remote', type: 'Full-time' },
  { role: 'Product Designer', team: 'Design · Remote', type: 'Full-time' },
  { role: 'Community Manager', team: 'Growth · Remote', type: 'Part-time' },
  { role: 'Trust & Safety Specialist', team: 'Operations · Remote', type: 'Full-time' },
];

const Careers = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Screen scroll header={<Header title="Careers" onBack={() => navigation.goBack()} />}>
      <Badge variant="primary">HIRING NOW</Badge>
      <Text style={[styles.title, { color: colors.txt }]}>Build the future of freelancing with us</Text>
      <Text style={[styles.body, { color: colors.txt2 }]}>
        Remote-first. Async-friendly. Generous equity. We look for builders who ship.
      </Text>

      <Text style={[styles.h2, { color: colors.txt }]}>Open roles</Text>
      {JOBS.map((j) => (
        <Card key={j.role} style={styles.jobCard}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.role, { color: colors.txt }]}>{j.role}</Text>
            <Text style={[styles.team, { color: colors.txt3 }]}>{j.team}</Text>
          </View>
          <Badge variant="success">{j.type}</Badge>
        </Card>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginTop: 14, letterSpacing: -0.5 },
  body: { fontSize: 14, lineHeight: 21, marginTop: 10 },
  h2: { fontSize: 18, fontWeight: '800', marginTop: 24, marginBottom: 10 },
  jobCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  role: { fontSize: 15, fontWeight: '800' },
  team: { fontSize: 12, marginTop: 3 },
});

export default Careers;
