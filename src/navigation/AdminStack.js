import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminOverview from '../screens/admin/AdminOverview';
import AdminUsers from '../screens/admin/AdminUsers';
import AdminJobs from '../screens/admin/AdminJobs';
import AdminDisputes from '../screens/admin/AdminDisputes';
import AdminFraud from '../screens/admin/AdminFraud';
import AdminReports from '../screens/admin/AdminReports';
import AdminAIRanking from '../screens/admin/AdminAIRanking';
import AdminLogs from '../screens/admin/AdminLogs';

const Stack = createNativeStackNavigator();

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="AdminOverview" component={AdminOverview} />
    <Stack.Screen name="AdminUsers" component={AdminUsers} />
    <Stack.Screen name="AdminJobs" component={AdminJobs} />
    <Stack.Screen name="AdminDisputes" component={AdminDisputes} />
    <Stack.Screen name="AdminFraud" component={AdminFraud} />
    <Stack.Screen name="AdminReports" component={AdminReports} />
    <Stack.Screen name="AdminAIRanking" component={AdminAIRanking} />
    <Stack.Screen name="AdminLogs" component={AdminLogs} />
  </Stack.Navigator>
);

export default AdminStack;
