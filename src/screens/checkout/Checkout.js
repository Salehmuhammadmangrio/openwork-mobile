import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useTheme } from '../../theme';
import { Screen, Header, EmptyState, Button } from '../../components/ui';
import { formatCurrency } from '../../utils/helpers';

const Checkout = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { url, amount, orderId } = route.params || {};
  const [loaded, setLoaded] = useState(false);
  const webRef = useRef(null);

  const onNav = (state) => {
    if (!state?.url) return;
    if (state.url.includes('topup-success') || state.url.includes('payment/success')) {
      navigation.replace('WalletTopupSuccess', { amount });
    } else if (state.url.includes('topup-cancel') || state.url.includes('payment/cancel')) {
      navigation.replace('WalletTopupCancel');
    }
  };

  if (!url) {
    return (
      <Screen header={<Header title="Checkout" onBack={() => navigation.goBack()} />}>
        <EmptyState icon="card-outline" title="No checkout session" description="Unable to start this payment." />
      </Screen>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header
        title="Secure checkout"
        subtitle={amount ? formatCurrency(amount) : undefined}
        onBack={() => navigation.goBack()}
      />
      <WebView
        ref={webRef}
        source={{ uri: url }}
        onLoadEnd={() => setLoaded(true)}
        onNavigationStateChange={onNav}
        style={{ flex: 1 }}
      />
      {!loaded ? (
        <View style={styles.spin}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  spin: { position: 'absolute', top: 90, left: 0, right: 0, alignItems: 'center' },
});

export default Checkout;
