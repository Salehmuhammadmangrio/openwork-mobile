import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../store';
import { Button, Input, Card, Alert, Chip } from '../../components/ui';
import { toast } from '../../utils/toast';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('freelancer');
  const [errors, setErrors] = useState({});
  const [formErr, setFormErr] = useState('');

  const onSubmit = async () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!emailRegex.test(email)) e.email = 'Please enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    setFormErr('');
    if (Object.keys(e).length) return;

    try {
      await register({ fullName: name.trim(), email: email.trim(), password, role });
      toast.success('Welcome to OpenWork!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      setFormErr(msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.txt} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.topLink, { color: colors.primary2 }]}>Sign in</Text>
          </Pressable>
        </View>

        <View style={styles.header}>
          <LinearGradient colors={['#6C4EF6', '#9B6DFF']} style={styles.logo}>
            <Text style={styles.logoTxt}>OW</Text>
          </LinearGradient>
          <Text style={[styles.title, { color: colors.txt }]}>Create your account</Text>
          <Text style={[styles.sub, { color: colors.txt2 }]}>Start finding or posting work in minutes</Text>
        </View>

        <Card style={styles.card}>
          {formErr ? <Alert variant="error" style={{ marginBottom: 14 }}>{formErr}</Alert> : null}

          <Text style={[styles.label, { color: colors.txt2 }]}>I want to…</Text>
          <View style={styles.chipRow}>
            <Chip
              label="Find work"
              active={role === 'freelancer'}
              onPress={() => setRole('freelancer')}
            />
            <Chip
              label="Hire talent"
              active={role === 'client'}
              onPress={() => setRole('client')}
            />
            <Chip
              label="Both"
              active={role === 'both'}
              onPress={() => setRole('both')}
            />
          </View>

          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
            error={errors.name}
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.txt3} />}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.txt3} />}
          />
          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.txt3} />}
          />

          <Button
            title="Create account"
            onPress={onSubmit}
            loading={isLoading}
            size="lg"
            full
            style={{ marginTop: 14 }}
          />

          <Text style={[styles.disclaim, { color: colors.txt3 }]}>
            By signing up, you agree to our Terms and Privacy Policy.
          </Text>
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footTxt, { color: colors.txt2 }]}>
            Already have an account?{' '}
            <Text
              style={{ color: colors.primary2, fontWeight: '800' }}
              onPress={() => navigation.navigate('Login')}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  topLink: { fontWeight: '700' },
  header: { alignItems: 'center', marginBottom: 22 },
  logo: { width: 58, height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoTxt: { color: '#fff', fontSize: 18, fontWeight: '900' },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  sub: { fontSize: 14, marginTop: 6 },
  card: { marginHorizontal: 16 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  disclaim: { fontSize: 11, textAlign: 'center', marginTop: 14, lineHeight: 16 },
  footer: { alignItems: 'center', marginTop: 24 },
  footTxt: { fontSize: 13, fontWeight: '600' },
});

export default Register;
