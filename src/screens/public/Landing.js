import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Button, Card, Badge } from '../../components/ui';

const FEATURES = [
  { icon: 'rocket-outline', title: 'AI Skill Certification', desc: 'Verified scores across 50+ domains build instant trust with clients.' },
  { icon: 'flash-outline', title: 'Smart Job Matching', desc: 'ML matches you with jobs where your success probability is highest.' },
  { icon: 'shield-checkmark-outline', title: 'Escrow Protection', desc: 'Milestone-based escrow. Funds locked until work is approved.' },
  { icon: 'chatbubbles-outline', title: 'Real-Time Chat', desc: 'WebSocket messaging with file sharing and full history.' },
  { icon: 'bar-chart-outline', title: 'Analytics Dashboard', desc: 'Earnings, proposal rates, AI score trends at a glance.' },
  { icon: 'bag-handle-outline', title: 'Open Offers', desc: 'List services with Basic/Standard/Premium packages.' },
];

const STEPS = [
  { n: '01', title: 'Create your account', desc: 'Sign up as a freelancer or client in under a minute.' },
  { n: '02', title: 'Verify your skills', desc: 'Take AI-graded tests and unlock premium visibility.' },
  { n: '03', title: 'Apply or post work', desc: 'Send proposals on jobs or publish offers clients can buy.' },
  { n: '04', title: 'Get paid securely', desc: 'Milestone-based escrow releases funds when work is approved.' },
];

const TESTIMONIALS = [
  { name: 'Aisha Khan', role: 'Full Stack Dev · Lahore', rating: 5, text: '"The AI skill test gave me credibility I couldn\'t get elsewhere. 3 project offers in 2 weeks."' },
  { name: 'Rahul Sharma', role: 'Product Designer · Mumbai', rating: 5, text: '"Best freelance experience. Secure payments and real-time chat saved so much time."' },
  { name: 'Chen Wei', role: 'AI Engineer · Singapore', rating: 5, text: '"Smart matching is a game changer. I only see jobs I have a real shot at."' },
];

const Landing = ({ navigation }) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero */}
        <LinearGradient
          colors={mode === 'dark' ? ['#0E0E18', '#181828', '#24173F'] : ['#EEF0FF', '#F7F7FB', '#FFFFFF']}
          style={[styles.hero, { paddingTop: insets.top + 24 }]}
        >
          <View style={styles.topBar}>
            <View style={styles.logoRow}>
              <LinearGradient
                colors={['#6C4EF6', '#9B6DFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoBadge}
              >
                <Text style={styles.logoTxt}>OW</Text>
              </LinearGradient>
              <Text style={[styles.brand, { color: colors.txt }]}>OpenWork</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Auth', { screen: 'Login' })}>
              <Text style={[styles.loginLink, { color: colors.primary2 }]}>Sign In</Text>
            </Pressable>
          </View>

          <View style={styles.heroBody}>
            <Badge variant="primary" style={{ marginBottom: 16 }}>
              {'\u2728'}  NEXT-GEN FREELANCE PLATFORM
            </Badge>
            <Text style={[styles.heroTitle, { color: colors.txt }]}>
              Work smarter.{'\n'}
              <Text style={{ color: colors.primary2 }}>Earn faster.</Text>
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.txt2 }]}>
              AI-powered matching, milestone escrow, and real-time collaboration — built for the next generation of freelancers and clients.
            </Text>

            <View style={styles.ctaRow}>
              <Button
                title="Get Started Free"
                onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
                size="lg"
                style={{ flex: 1 }}
                full
              />
              <Button
                title="Sign In"
                variant="ghost"
                onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                size="lg"
                style={{ flex: 1 }}
                full
              />
            </View>

            <View style={styles.statsRow}>
              <Stat n="10K+" label="Freelancers" colors={colors} />
              <Stat n="2.5K+" label="Active Jobs" colors={colors} />
              <Stat n="98%" label="Satisfaction" colors={colors} />
            </View>
          </View>
        </LinearGradient>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.eyebrow, { color: colors.primary2 }]}>FEATURES</Text>
          <Text style={[styles.sectionTitle, { color: colors.txt }]}>Everything you need to succeed</Text>
          <Text style={[styles.sectionSub, { color: colors.txt2 }]}>
            Tools that help you stand out, win work, and get paid faster.
          </Text>

          <View style={styles.featGrid}>
            {FEATURES.map((f) => (
              <Card key={f.title} style={styles.featCard}>
                <View style={[styles.featIconWrap, { backgroundColor: 'rgba(108,78,246,0.14)' }]}>
                  <Ionicons name={f.icon} size={22} color={colors.primary2} />
                </View>
                <Text style={[styles.featTitle, { color: colors.txt }]}>{f.title}</Text>
                <Text style={[styles.featDesc, { color: colors.txt2 }]}>{f.desc}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={[styles.eyebrow, { color: colors.primary2 }]}>HOW IT WORKS</Text>
          <Text style={[styles.sectionTitle, { color: colors.txt }]}>Four simple steps</Text>
          {STEPS.map((s) => (
            <Card key={s.n} style={styles.stepCard}>
              <Text style={[styles.stepNum, { color: colors.primary2 }]}>{s.n}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepTitle, { color: colors.txt }]}>{s.title}</Text>
                <Text style={[styles.stepDesc, { color: colors.txt2 }]}>{s.desc}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={[styles.eyebrow, { color: colors.primary2 }]}>TESTIMONIALS</Text>
          <Text style={[styles.sectionTitle, { color: colors.txt }]}>Loved by freelancers worldwide</Text>
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} style={{ marginBottom: 12 }}>
              <View style={styles.starRow}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color={colors.warn} />
                ))}
              </View>
              <Text style={[styles.tText, { color: colors.txt }]}>{t.text}</Text>
              <Text style={[styles.tName, { color: colors.txt }]}>{t.name}</Text>
              <Text style={[styles.tRole, { color: colors.txt3 }]}>{t.role}</Text>
            </Card>
          ))}
        </View>

        {/* CTA */}
        <View style={[styles.section, { paddingTop: 10 }]}>
          <LinearGradient colors={['#6C4EF6', '#9B6DFF']} style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to transform your freelance career?</Text>
            <Text style={styles.ctaSub}>Join OpenWork today — free, fast, and built for you.</Text>
            <Button
              title="Create Free Account"
              variant="secondary"
              onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
              style={{ backgroundColor: '#fff', marginTop: 16, borderColor: 'transparent' }}
              textStyle={{ color: '#6C4EF6' }}
            />
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={[styles.section, { paddingTop: 8 }]}>
          <View style={styles.footRow}>
            <Pressable onPress={() => navigation.navigate('AboutUs')}>
              <Text style={[styles.footLink, { color: colors.txt2 }]}>About</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Careers')}>
              <Text style={[styles.footLink, { color: colors.txt2 }]}>Careers</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Blog')}>
              <Text style={[styles.footLink, { color: colors.txt2 }]}>Blog</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Security')}>
              <Text style={[styles.footLink, { color: colors.txt2 }]}>Security</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={[styles.footLink, { color: colors.txt2 }]}>Privacy</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Terms')}>
              <Text style={[styles.footLink, { color: colors.txt2 }]}>Terms</Text>
            </Pressable>
          </View>
          <Text style={[styles.copy, { color: colors.txt3 }]}>
            © {new Date().getFullYear()} OpenWork. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const Stat = ({ n, label, colors }) => (
  <View style={styles.stat}>
    <Text style={[styles.statN, { color: colors.txt }]}>{n}</Text>
    <Text style={[styles.statL, { color: colors.txt2 }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingBottom: 28 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  brand: { fontSize: 20, fontWeight: '800' },
  loginLink: { fontWeight: '700' },
  heroBody: { paddingVertical: 20 },
  heroTitle: { fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  heroSubtitle: { marginTop: 16, fontSize: 15, lineHeight: 22 },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  statsRow: { flexDirection: 'row', gap: 18, marginTop: 30 },
  stat: { flex: 1 },
  statN: { fontSize: 22, fontWeight: '800' },
  statL: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  section: { paddingHorizontal: 20, paddingTop: 32 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  sectionTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sectionSub: { fontSize: 14, lineHeight: 21, marginTop: 8 },
  featGrid: { marginTop: 18, gap: 12 },
  featCard: { padding: 16 },
  featIconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  featTitle: { fontSize: 16, fontWeight: '800' },
  featDesc: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  stepCard: { flexDirection: 'row', gap: 14, marginTop: 12, alignItems: 'flex-start' },
  stepNum: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  stepTitle: { fontSize: 15, fontWeight: '800' },
  stepDesc: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  starRow: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  tText: { fontSize: 14, lineHeight: 21, fontStyle: 'italic' },
  tName: { fontSize: 14, fontWeight: '800', marginTop: 10 },
  tRole: { fontSize: 12, marginTop: 2 },
  ctaCard: { borderRadius: 18, padding: 24 },
  ctaTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  ctaSub: { color: 'rgba(255,255,255,0.85)', marginTop: 8, fontSize: 14, lineHeight: 20 },
  footRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 16 },
  footLink: { fontSize: 13, fontWeight: '600' },
  copy: { fontSize: 11, textAlign: 'center', marginTop: 16 },
});

export default Landing;
