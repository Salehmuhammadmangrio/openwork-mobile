import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../store';
import { Button, Input, Card, Alert } from '../../components/ui';
import { toast } from '../../utils/toast';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = ({ navigation }) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [formErr, setFormErr] = useState('');

  const onSubmit = async () => {
    setEmailErr('');
    setPassErr('');
    setFormErr('');
    if (!email.trim()) return setEmailErr('Email is required');
    if (!emailRegex.test(email)) return setEmailErr('Please enter a valid email');
    if (!password) return setPassErr('Password is required');
    if (password.length < 6) return setPassErr('Password must be at least 6 characters');

    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      if (/user|email|not found/i.test(msg)) setEmailErr(msg);
      else if (/password/i.test(msg)) setPassErr(msg);
      else setFormErr(msg);
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
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.topLink, { color: colors.primary2 }]}>Create account</Text>
          </Pressable>
        </View>

        <View style={styles.header}>
          <LinearGradient
            colors={['#6C4EF6', '#9B6DFF']}
            style={styles.logo}
          >
            <Text style={styles.logoTxt}>OW</Text>
          </LinearGradient>
          <Text style={[styles.title, { color: colors.txt }]}>Welcome back</Text>
          <Text style={[styles.sub, { color: colors.txt2 }]}>
            Sign in to continue your journey
          </Text>
        </View>

        <Card style={styles.card}>
          {formErr ? (
            <Alert variant="error" style={{ marginBottom: 14 }}>{formErr}</Alert>
          ) : null}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailErr}
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.txt3} />}
          />
          <Input
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passErr}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.txt3} />}
          />

          <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end' }}>
            <Text style={[styles.forgot, { color: colors.primary2 }]}>Forgot password?</Text>
          </Pressable>

          <Button
            title="Sign in"
            onPress={onSubmit}
            loading={isLoading}
            size="lg"
            full
            style={{ marginTop: 18 }}
          />

          <View style={styles.dividerRow}>
            <View style={[styles.divLine, { backgroundColor: colors.b1 }]} />
            <Text style={[styles.divTxt, { color: colors.txt3 }]}>OR</Text>
            <View style={[styles.divLine, { backgroundColor: colors.b1 }]} />
          </View>

          <Button
            title="Continue without account"
            variant="ghost"
            size="lg"
            full
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Public' }] })}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footTxt, { color: colors.txt2 }]}>
            Don't have an account?{' '}
            <Text
              style={{ color: colors.primary2, fontWeight: '800' }}
              onPress={() => navigation.navigate('Register')}
            >
              Sign up
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
  header: { alignItems: 'center', marginTop: 6, marginBottom: 22 },
  logo: { width: 58, height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoTxt: { color: '#fff', fontSize: 18, fontWeight: '900' },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  sub: { fontSize: 14, marginTop: 6 },
  card: { marginHorizontal: 16 },
  forgot: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  divLine: { flex: 1, height: 1 },
  divTxt: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  footer: { alignItems: 'center', marginTop: 24 },
  footTxt: { fontSize: 13, fontWeight: '600' },
});

export default Login;
