import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Badge, Button, Input, Textarea, Loading, EmptyState, Alert } from '../../components/ui';
import api from '../../utils/api';
import { useAuthStore } from '../../store';
import { formatCurrency, formatRelative, safeArray } from '../../utils/helpers';
import { toast } from '../../utils/toast';

const DELIVERY_OPTIONS = ['3 days', '1 week', '2 weeks', '3 weeks', '1 month', '2 months'];

const JobDetail = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { id } = route.params || {};
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data?.job || data);
      } catch {
        setJob(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!job || activeRole !== 'freelancer') return;
    (async () => {
      try {
        const { data } = await api.get(`/proposals/job/${id}`);
        setAlreadyApplied(!!data?.proposal);
      } catch {}
    })();
  }, [job, id, activeRole]);

  if (loading) {
    return <Screen header={<Header title="Job details" onBack={() => navigation.goBack()} />}><Loading /></Screen>;
  }
  if (!job) {
    return (
      <Screen header={<Header title="Job details" onBack={() => navigation.goBack()} />}>
        <EmptyState icon="alert-circle-outline" title="Job not found" />
      </Screen>
    );
  }

  const isOwner = job.client?._id === user?._id;

  return (
    <Screen scroll header={<Header title="Job details" onBack={() => navigation.goBack()} />}>
      <Card>
        <View style={styles.rowBetween}>
          <Text style={[styles.title, { color: colors.txt }]}>{job.title}</Text>
          {job.isUrgent ? <Badge variant="warning">URGENT</Badge> : null}
        </View>
        <Text style={[styles.meta, { color: colors.txt3 }]}>
          {job.client?.companyName || job.client?.fullName || 'Client'} · {formatRelative(job.createdAt)}
        </Text>
        <View style={styles.budgetRow}>
          <Ionicons name="cash-outline" size={15} color={colors.ok} />
          <Text style={[styles.budget, { color: colors.ok }]}>
            {formatCurrency(job.budgetMin || 0)} – {formatCurrency(job.budgetMax || 0)}
          </Text>
          <Text style={[styles.meta, { color: colors.txt3 }]}>· {job.category || 'General'}</Text>
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Text style={[styles.h, { color: colors.txt }]}>Description</Text>
        <Text style={[styles.body, { color: colors.txt2 }]}>{job.description}</Text>
      </Card>

      {safeArray(job.skills).length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.h, { color: colors.txt }]}>Required skills</Text>
          <View style={styles.skills}>
            {job.skills.map((s) => (
              <Badge key={s} variant="primary" style={{ marginRight: 6, marginBottom: 6 }}>{s}</Badge>
            ))}
          </View>
        </Card>
      )}

      <Card style={{ marginTop: 12 }}>
        <Text style={[styles.h, { color: colors.txt }]}>About client</Text>
        <Text style={[styles.body, { color: colors.txt2 }]}>
          {job.client?.companyName || job.client?.fullName || 'Client'}
          {job.client?.location ? ` · ${job.client.location}` : ''}
        </Text>
      </Card>

      <View style={{ height: 14 }} />

      {activeRole === 'freelancer' && !isOwner ? (
        alreadyApplied ? (
          <Alert variant="success" title="You've already applied">Your proposal is being reviewed.</Alert>
        ) : (
          <Button title="Apply with a proposal" size="lg" full onPress={() => setApplyOpen(true)} />
        )
      ) : isOwner ? (
        <Button
          title="View received proposals"
          variant="secondary"
          size="lg"
          full
          onPress={() => navigation.navigate('ReceivedProposals', { jobId: id })}
        />
      ) : null}

      <ApplyModal
        visible={applyOpen}
        onClose={() => setApplyOpen(false)}
        jobId={id}
        jobTitle={job.title}
        onSuccess={() => setAlreadyApplied(true)}
      />
    </Screen>
  );
};

const ApplyModal = ({ visible, onClose, jobId, jobTitle, onSuccess }) => {
  const { colors } = useTheme();
  const [bid, setBid] = useState('');
  const [delivery, setDelivery] = useState('2 weeks');
  const [cover, setCover] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  const handleAI = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post(`/ai/proposal/${jobId}`);
      setCover(data.proposal?.generatedText || data.proposal || '');
      setIsAIGenerated(true);
      toast.success('AI proposal generated');
    } catch {
      toast.error('AI unavailable — try again');
    } finally {
      setAiLoading(false);
    }
  };

  const submit = async () => {
    if (!bid || !cover.trim()) return toast.error('Bid and cover letter are required');
    if (cover.trim().length < 20) return toast.error('Cover letter must be at least 20 chars');
    if (parseFloat(bid) <= 0) return toast.error('Bid must be > 0');
    setLoading(true);
    try {
      await api.post(`/proposals/job/${jobId}`, {
        bidAmount: parseFloat(bid),
        deliveryTime: delivery,
        coverLetter: cover,
        isAIGenerated,
      });
      toast.success('Proposal submitted');
      onSuccess?.();
      onClose();
      setBid(''); setCover(''); setDelivery('2 weeks'); setIsAIGenerated(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.bg2 }]}>
            <View style={styles.modalHead}>
              <Text style={[styles.modalTitle, { color: colors.txt }]}>Apply for job</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Ionicons name="close" size={24} color={colors.txt2} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 500 }} keyboardShouldPersistTaps="handled">
              <Text style={[styles.jobTitle, { color: colors.txt }]}>{jobTitle}</Text>
              <Input
                label="Your bid ($)"
                value={bid}
                onChangeText={setBid}
                keyboardType="decimal-pad"
                placeholder="Enter your rate"
              />
              <Text style={[styles.label, { color: colors.txt2 }]}>Delivery time</Text>
              <View style={styles.deliveryRow}>
                {DELIVERY_OPTIONS.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setDelivery(d)}
                    style={[
                      styles.delChip,
                      {
                        backgroundColor: delivery === d ? 'rgba(108,78,246,0.18)' : colors.s2,
                        borderColor: delivery === d ? colors.primary : colors.b2,
                      },
                    ]}
                  >
                    <Text style={{
                      color: delivery === d ? colors.primary2 : colors.txt2,
                      fontWeight: '700', fontSize: 12,
                    }}>{d}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.coverHead}>
                <Text style={[styles.label, { color: colors.txt2 }]}>Cover letter</Text>
                <Button title="AI Write" variant="ghost" size="xs" loading={aiLoading} onPress={handleAI} />
              </View>
              <Textarea
                value={cover}
                onChangeText={setCover}
                placeholder="Tell the client why you're the best fit…"
                rows={6}
              />
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Button title="Cancel" variant="ghost" full onPress={onClose} style={{ flex: 1 }} />
              <Button title="Submit" full loading={loading} onPress={submit} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', flex: 1, lineHeight: 28 },
  meta: { fontSize: 12, marginTop: 6 },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  budget: { fontSize: 15, fontWeight: '800' },
  h: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
  skills: { flexDirection: 'row', flexWrap: 'wrap' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalCard: { padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '92%' },
  modalHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  jobTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 },
  deliveryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  delChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  coverHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default JobDetail;
