import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Card, Badge } from '../../components/ui';
import { useTheme } from '../../theme';

const POSTS = [
  { title: '5 proposals that actually win high-budget jobs', tag: 'Freelancer tips', read: '6 min read' },
  { title: 'Inside our AI scoring: what the score really means', tag: 'Engineering', read: '9 min read' },
  { title: 'Escrow explained: how milestone payments protect you', tag: 'Trust & safety', read: '4 min read' },
  { title: 'Hiring your first freelancer — a client playbook', tag: 'Clients', read: '7 min read' },
  { title: 'Remote work is here to stay — and it\'s winning', tag: 'Industry', read: '5 min read' },
];

const Blog = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Screen scroll header={<Header title="Blog" onBack={() => navigation.goBack()} />}>
      <Text style={[styles.title, { color: colors.txt }]}>OpenWork Insights</Text>
      <Text style={[styles.body, { color: colors.txt2 }]}>
        Stories, tips, and updates from our team and community.
      </Text>

      {POSTS.map((p) => (
        <Card key={p.title} style={styles.card}>
          <Badge variant="primary" style={{ marginBottom: 10 }}>{p.tag}</Badge>
          <Text style={[styles.pTitle, { color: colors.txt }]}>{p.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color={colors.txt3} />
            <Text style={[styles.meta, { color: colors.txt3 }]}>{p.read}</Text>
          </View>
        </Card>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginTop: 4, letterSpacing: -0.5 },
  body: { fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 20 },
  card: { marginBottom: 12 },
  pTitle: { fontSize: 16, fontWeight: '800', lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  meta: { fontSize: 12, fontWeight: '600' },
});

export default Blog;
