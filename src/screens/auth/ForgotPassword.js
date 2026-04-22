import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Input, Button, Card, Alert } from '../../components/ui';
import { useAuthStore } from '../../store';
import { toast } from '../../utils/toast';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = ({ navigation }) => {
  const { colors } = useTheme();
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    setError('');
    if (!email.trim()) return setError('Email is required');
    if (!emailRegex.test(email)) return setError('Please enter a valid email');
    try {
      setLoading(true);
      await forgotPassword(email.trim());
      setSent(true);
      toast.success('Reset link sent');
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboardAware header={<Header title="Forgot password" onBack={() => navigation.goBack()} />}>
      <Card style={{ marginTop: 8 }}>
        {sent ? (
          <Alert variant="success" title="Check your email">
            We've sent a password reset link to {email}. Please click the link to continue.
          </Alert>
        ) : (
          <>
            <Text style={[styles.p, { color: colors.txt2 }]}>
              Enter the email associated with your account and we'll send you a link to reset your password.
            </Text>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
              leftIcon={<Ionicons name="mail-outline" size={18} color={colors.txt3} />}
            />
            <Button
              title="Send reset link"
              loading={loading}
              onPress={onSubmit}
              size="lg"
              full
            />
          </>
        )}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  p: { fontSize: 14, lineHeight: 21, marginBottom: 14 },
});

export default ForgotPassword;
