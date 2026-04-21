import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Loading, EmptyState, Button } from '../../components/ui';
import api from '../../utils/api';
import { formatRelative, safeArray } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const SkillTests = ({ navigation }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(null);
  const [answer, setAnswer] = useState({});
  const [qIdx, setQIdx] = useState(0);
  const [taking, setTaking] = useState(false);

  const load = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    try {
      const [a, b] = await Promise.all([
        api.get('/skill-tests').catch(() => ({ data: {} })),
        api.get('/skill-tests/mine').catch(() => ({ data: {} })),
      ]);
      setItems(safeArray(a.data?.tests));
      setMine(safeArray(b.data?.results));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const start = (t) => {
    setActive(t);
    setQIdx(0);
    setAnswer({});
  };

  const submit = async () => {
    setTaking(true);
    try {
      const answers = Object.entries(answer).map(([q, a]) => ({ questionId: q, answer: a }));
      await api.post(`/skill-tests/${active._id}/submit`, { answers });
      toast.success('Test submitted');
      setActive(null);
      await load(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    } finally {
      setTaking(false);
    }
  };

  const doneIds = new Set(mine.map((m) => m.test?._id || m.test));

  return (
    <Screen padded={false} header={<Header title="Skill tests" onBack={() => navigation.goBack()} />}>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(t) => t._id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<EmptyState icon="school-outline" title="No tests available" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(false); }} tintColor={colors.primary} />}
          renderItem={({ item: t }) => {
            const done = doneIds.has(t._id);
            const myResult = mine.find((m) => (m.test?._id || m.test) === t._id);
            return (
              <Card style={{ marginBottom: 10 }}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.title, { color: colors.txt }]}>{t.title}</Text>
                  {done ? (
                    <Badge variant={myResult?.passed ? 'success' : 'danger'}>
                      {myResult?.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  ) : null}
                </View>
                <Text style={[styles.body, { color: colors.txt2 }]}>{t.description}</Text>
                <View style={styles.stats}>
                  <View style={styles.stat}>
                    <Ionicons name="help-circle-outline" size={14} color={colors.txt3} />
                    <Text style={{ color: colors.txt3, fontSize: 12 }}>{(t.questions || []).length} questions</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="time-outline" size={14} color={colors.txt3} />
                    <Text style={{ color: colors.txt3, fontSize: 12 }}>{t.durationMinutes || 15} min</Text>
                  </View>
                </View>
                <Button title={done ? 'Retake' : 'Start test'} full size="sm" style={{ marginTop: 10 }} variant={done ? 'ghost' : 'primary'} onPress={() => start(t)} />
              </Card>
            );
          }}
        />
      )}

      <Modal visible={!!active} animationType="slide" onRequestClose={() => setActive(null)}>
        {active ? (
          <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <Header title={`${active.title} · ${qIdx + 1}/${active.questions?.length || 0}`} onBack={() => setActive(null)} />
            <View style={{ padding: 16, flex: 1 }}>
              {active.questions?.[qIdx] ? (
                <>
                  <Text style={[styles.q, { color: colors.txt }]}>{active.questions[qIdx].text}</Text>
                  {safeArray(active.questions[qIdx].options).map((opt, i) => {
                    const selected = answer[active.questions[qIdx]._id] === (opt.value || i);
                    return (
                      <Pressable
                        key={i}
                        onPress={() => setAnswer({ ...answer, [active.questions[qIdx]._id]: opt.value ?? i })}
                        style={[
                          styles.option,
                          { borderColor: selected ? colors.primary : colors.b1, backgroundColor: selected ? 'rgba(108,78,246,0.1)' : colors.s1 },
                        ]}
                      >
                        <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.b1 }]}>
                          {selected ? <View style={[styles.radioDot, { backgroundColor: colors.primary }]} /> : null}
                        </View>
                        <Text style={{ color: colors.txt, flex: 1, fontSize: 14 }}>{opt.label || opt.text || opt}</Text>
                      </Pressable>
                    );
                  })}
                </>
              ) : null}
            </View>
            <View style={{ padding: 16, flexDirection: 'row', gap: 10 }}>
              <Button title="Prev" variant="ghost" disabled={qIdx === 0} onPress={() => setQIdx(qIdx - 1)} style={{ flex: 1 }} full />
              {qIdx < (active.questions?.length || 0) - 1 ? (
                <Button title="Next" onPress={() => setQIdx(qIdx + 1)} style={{ flex: 1 }} full />
              ) : (
                <Button title="Submit" loading={taking} onPress={submit} style={{ flex: 1 }} full />
              )}
            </View>
          </View>
        ) : null}
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 15, fontWeight: '800', flex: 1, paddingRight: 8 },
  body: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  stats: { flexDirection: 'row', gap: 16, marginTop: 10 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  q: { fontSize: 17, fontWeight: '800', lineHeight: 24, marginBottom: 16 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});

export default SkillTests;
