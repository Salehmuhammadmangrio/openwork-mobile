import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert as RNAlert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Button, Input } from '../../components/ui';
import { useAuthStore, useThemeStore } from '../../store';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const Settings = ({ navigation }) => {
  const { colors, mode } = useTheme();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwBusy, setPwBusy] = useState(false);

  const [emailPrefs, setEmailPrefs] = useState({
    messages: user?.notif?.email?.messages ?? true,
    orders: user?.notif?.email?.orders ?? true,
    marketing: user?.notif?.email?.marketing ?? false,
  });
  const [prefsBusy, setPrefsBusy] = useState(false);

  const changePw = async () => {
    if (!oldPw || newPw.length < 6) return toast.error('Enter valid passwords');
    setPwBusy(true);
    try {
      await api.put('/auth/change-password', { oldPassword: oldPw, newPassword: newPw });
      toast.success('Password updated');
      setOldPw('');
      setNewPw('');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setPwBusy(false);
    }
  };

  const savePrefs = async () => {
    setPrefsBusy(true);
    try {
      await api.put('/users/me/notif-prefs', { email: emailPrefs });
      toast.success('Preferences saved');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setPrefsBusy(false);
    }
  };

  const confirmDelete = () => {
    RNAlert.alert('Delete account?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete('/auth/me');
            toast.success('Account deleted');
            await logout();
          } catch (e) {
            toast.error(e?.response?.data?.message || 'Failed');
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll keyboardAware header={<Header title="Settings" onBack={() => navigation.goBack()} />}>
      <Card>
        <View style={styles.row}>
          <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.primary2} />
          <Text style={[styles.label, { color: colors.txt }]}>Dark mode</Text>
          <Switch value={mode === 'dark'} onValueChange={toggleTheme} thumbColor={mode === 'dark' ? colors.primary : '#fff'} trackColor={{ true: 'rgba(108,78,246,0.5)', false: colors.b1 }} />
        </View>
      </Card>

      <Text style={[styles.h, { color: colors.txt2 }]}>EMAIL NOTIFICATIONS</Text>
      <Card>
        {[
          ['messages', 'New messages'],
          ['orders', 'Order updates'],
          ['marketing', 'Product & promos'],
        ].map(([k, l], i) => (
          <View key={k} style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.b1, paddingTop: 12, marginTop: 4 }]}>
            <Text style={[styles.label, { color: colors.txt, marginLeft: 0 }]}>{l}</Text>
            <Switch value={emailPrefs[k]} onValueChange={(v) => setEmailPrefs({ ...emailPrefs, [k]: v })} thumbColor={emailPrefs[k] ? colors.primary : '#fff'} trackColor={{ true: 'rgba(108,78,246,0.5)', false: colors.b1 }} />
          </View>
        ))}
        <Button title="Save preferences" variant="ghost" size="sm" loading={prefsBusy} onPress={savePrefs} style={{ marginTop: 10, alignSelf: 'flex-start' }} />
      </Card>

      <Text style={[styles.h, { color: colors.txt2 }]}>PASSWORD</Text>
      <Card>
        <Input label="Current password" secureTextEntry value={oldPw} onChangeText={setOldPw} />
        <Input label="New password" secureTextEntry value={newPw} onChangeText={setNewPw} />
        <Button title="Update password" loading={pwBusy} onPress={changePw} size="md" />
      </Card>

      <Text style={[styles.h, { color: colors.txt2 }]}>DANGER ZONE</Text>
      <Card>
        <Button title="Delete account" variant="danger" full onPress={confirmDelete} />
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  label: { fontSize: 14, fontWeight: '700', flex: 1, marginLeft: 12 },
  h: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 22, marginBottom: 10, marginLeft: 4 },
});

export default Settings;
