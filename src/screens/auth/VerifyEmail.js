import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme';
import { Screen, Header, Loading, Alert, Button, Card } from '../../components/ui';
import { useAuthStore } from '../../store';

const VerifyEmail = ({ navigation, route }) => {
  const { colors } = useTheme();
  const token = route?.params?.token;
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const [state, setState] = useState({ loading: !!token, error: null, done: false });

  useEffect(() => {
    if (!token) {
      setState({ loading: false, error: null, done: false });
      return;
    }
    (async () => {
      try {
        await verifyEmail(token);
        setState({ loading: false, error: null, done: true });
      } catch (e) {
        setState({ loading: false, error: e?.response?.data?.message || 'Verification failed', done: false });
      }
    })();
  }, [token]);

  return (
    <Screen scroll header={<Header title="Verify email" onBack={() => navigation.goBack()} />}>
      <Card style={{ marginTop: 8 }}>
        {state.loading ? (
          <Loading text="Verifying your email…" />
        ) : state.error ? (
          <>
            <Alert variant="error" title="Verification failed">{state.error}</Alert>
            <Button title="Go home" full size="lg" style={{ marginTop: 14 }} onPress={() => navigation.replace('Login')} />
          </>
        ) : state.done ? (
          <>
            <Alert variant="success" title="Email verified">Your email has been verified. Welcome!</Alert>
            <Button title="Continue" full size="lg" style={{ marginTop: 14 }} onPress={() => navigation.replace('Login')} />
          </>
        ) : (
          <>
            <Alert variant="info" title="Check your inbox">
              We've sent a verification link to your email. Tap the link to verify your account.
            </Alert>
            <Button title="Back to sign in" full size="lg" variant="ghost" style={{ marginTop: 14 }} onPress={() => navigation.replace('Login')} />
          </>
        )}
      </Card>
    </Screen>
  );
};

export default VerifyEmail;
