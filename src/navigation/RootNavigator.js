import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useAuthStore } from '../store';
import { useTheme } from '../theme';
import { navigationRef } from './navigationRef';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import AdminStack from './AdminStack';
import PublicStack from './PublicStack';

// Screens pushed on top of the tabs
import JobDetail from '../screens/browse/JobDetail';
import OfferDetail from '../screens/browse/OfferDetail';
import FreelancerProfile from '../screens/browse/FreelancerProfile';
import ViewProposal from '../screens/browse/ViewProposal';
import EditOffer from '../screens/browse/EditOffer';
import CreateOrder from '../screens/browse/CreateOrder';
import PostJob from '../screens/dashboard/PostJob';
import Orders from '../screens/dashboard/Orders';
import OrderDetail from '../screens/dashboard/OrderDetail';
import DeliverOrder from '../screens/dashboard/DeliverOrder';
import ReviewDeliveredOrder from '../screens/dashboard/ReviewDeliveredOrder';
import Milestones from '../screens/dashboard/Milestones';
import MyJobs from '../screens/dashboard/MyJobs';
import MyOffers from '../screens/dashboard/MyOffers';
import Proposals from '../screens/dashboard/Proposals';
import ReceivedProposals from '../screens/dashboard/ReceivedProposals';
import Reviews from '../screens/dashboard/Reviews';
import DashProfile from '../screens/dashboard/DashProfile';
import Analytics from '../screens/dashboard/Analytics';
import Payments from '../screens/dashboard/Payments';
import Disputes from '../screens/dashboard/Disputes';
import SkillTests from '../screens/dashboard/SkillTests';
import Notifications from '../screens/dashboard/Notifications';
import Settings from '../screens/dashboard/Settings';
import ChatScreen from '../screens/dashboard/ChatScreen';
import Checkout from '../screens/checkout/Checkout';
import WalletTopupSuccess from '../screens/checkout/WalletTopupSuccess';
import WalletTopupCancel from '../screens/checkout/WalletTopupCancel';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [Linking.createURL('/'), 'openwork://'],
  config: {
    screens: {
      Public: { screens: { Landing: '' } },
      Auth: { screens: { Login: 'login', Register: 'register' } },
      Main: { screens: { Home: 'home' } },
    },
  },
};

const RootNavigator = () => {
  const { mode, colors } = useTheme();
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // Wait for rehydration to avoid auth flicker
  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated()) {
      const unsub = useAuthStore.persist.onFinishHydration(() => {});
      return unsub;
    }
  }, []);

  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.bg,
      card: colors.bg,
      primary: colors.primary,
      text: colors.txt,
      border: colors.b1,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!hydrated ? null : !isAuth ? (
          <>
            <Stack.Screen name="Public" component={PublicStack} />
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        ) : user?.role === 'admin' ? (
          <>
            <Stack.Screen name="Admin" component={AdminStack} />
            <Stack.Screen name="Main" component={MainTabs} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
        <Stack.Screen name="JobDetail" component={JobDetail} />
        <Stack.Screen name="OfferDetail" component={OfferDetail} />
        <Stack.Screen name="FreelancerProfile" component={FreelancerProfile} />
        <Stack.Screen name="ViewProposal" component={ViewProposal} />
        <Stack.Screen name="EditOffer" component={EditOffer} />
        <Stack.Screen name="CreateOrder" component={CreateOrder} />
        <Stack.Screen name="PostJob" component={PostJob} />
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="DeliverOrder" component={DeliverOrder} />
        <Stack.Screen name="ReviewDeliveredOrder" component={ReviewDeliveredOrder} />
        <Stack.Screen name="Milestones" component={Milestones} />
        <Stack.Screen name="MyJobs" component={MyJobs} />
        <Stack.Screen name="MyOffers" component={MyOffers} />
        <Stack.Screen name="Proposals" component={Proposals} />
        <Stack.Screen name="ReceivedProposals" component={ReceivedProposals} />
        <Stack.Screen name="Reviews" component={Reviews} />
        <Stack.Screen name="DashProfile" component={DashProfile} />
        <Stack.Screen name="Analytics" component={Analytics} />
        <Stack.Screen name="Payments" component={Payments} />
        <Stack.Screen name="Disputes" component={Disputes} />
        <Stack.Screen name="SkillTests" component={SkillTests} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="WalletTopupSuccess" component={WalletTopupSuccess} />
        <Stack.Screen name="WalletTopupCancel" component={WalletTopupCancel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
