import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from '../screens/public/Landing';
import AboutUs from '../screens/public/AboutUs';
import Careers from '../screens/public/Careers';
import Blog from '../screens/public/Blog';
import PrivacyPolicy from '../screens/public/PrivacyPolicy';
import Terms from '../screens/public/Terms';
import Security from '../screens/public/Security';

const Stack = createNativeStackNavigator();

const PublicStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Landing" component={Landing} />
    <Stack.Screen name="AboutUs" component={AboutUs} />
    <Stack.Screen name="Careers" component={Careers} />
    <Stack.Screen name="Blog" component={Blog} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    <Stack.Screen name="Terms" component={Terms} />
    <Stack.Screen name="Security" component={Security} />
  </Stack.Navigator>
);

export default PublicStack;
