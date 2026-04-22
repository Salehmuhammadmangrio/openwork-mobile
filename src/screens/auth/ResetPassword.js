import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Input, Button, Card, Alert } from '../../components/ui';
import { useAuthStore } from '../../store';
import { toast } from '../../utils/toast';

const ResetPassword = ({ navigation, route }) => {
  const { colors } = useTheme();
  const token = route?.params?.token || '';
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async () => {
    setError('');
    if (!token) return setError('Missing reset token');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    try {
      setLoading(true);
      await resetPassword(token, password);
      setDone(true);
      toast.success('Password updated');
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboardAware header={<Header title="Reset password" onBack={() => navigation.goBack()} />}>
      <Card style={{ marginTop: 8 }}>
        {done ? (
          <>
            <Alert variant="success" title="Password updated">
              You can now sign in with your new password.
            </Alert>
            <Button title="Sign in" full size="lg" style={{ marginTop: 14 }} onPress={() => navigation.replace('Login')} />
          </>
        ) : (
          <>
            {error ? <Alert variant="error" style={{ marginBottom: 14 }}>{error}</Alert> : null}
            <Input
              label="New password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.txt3} />}
            />
            <Input
              label="Confirm new password"
              placeholder="Re-enter password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.txt3} />}
            />
            <Button title="Update password" loading={loading} onPress={onSubmit} size="lg" full />
          </>
        )}
      </Card>
    </Screen>
  );
};

export default ResetPassword;
