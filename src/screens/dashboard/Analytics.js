import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Screen, Header, Card, Loading, EmptyState, SectionTitle } from '../../components/ui';
import api from '../../utils/api';
import { formatCurrency, formatCompactNumber, safeArray } from '../../utils/helpers';
import { useAuthStore } from '../../store';

const Analytics = ({ navigation }) => {
  const { colors, mode } = useTheme();
  const activeRole = useAuthStore((s) => s.activeRole);
  const [stats, setStats] = useState(null);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/dashboard/analytics');
        setStats(data?.stats || data || {});
        setSeries(safeArray(data?.series || data?.timeline));
      } catch {
        setStats({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isFreelancer = activeRole === 'freelancer';
  const width = Dimensions.get('window').width - 48;

  const chartConfig = {
    backgroundGradientFrom: colors.s1,
    backgroundGradientTo: colors.s1,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(108, 78, 246, ${opacity})`,
    labelColor: () => colors.txt3,
    strokeWidth: 2,
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#9B6DFF' },
    propsForBackgroundLines: { stroke: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
  };

  const labels = series.slice(-7).map((s) => (s.label || s.date || '').slice(0, 3));
  const values = series.slice(-7).map((s) => Number(s.value || s.amount || s.count || 0));
  const hasChart = labels.length > 1;

  return (
    <Screen scroll header={<Header title="Analytics" onBack={() => navigation.goBack()} />}>
      {loading ? (
        <Loading />
      ) : !stats ? (
        <EmptyState icon="bar-chart-outline" title="No analytics yet" />
      ) : (
        <>
          <View style={styles.grid}>
            <StatCard
              colors={colors}
              icon="trending-up"
              label={isFreelancer ? 'Earnings' : 'Spend'}
              value={formatCurrency(isFreelancer ? stats.totalEarnings || 0 : stats.totalSpend || 0)}
            />
            <StatCard colors={colors} icon="checkmark-done" label="Completed" value={formatCompactNumber(stats.completedOrders || 0)} />
            <StatCard colors={colors} icon="time-outline" label="Active" value={formatCompactNumber(stats.activeOrders || 0)} />
            <StatCard colors={colors} icon="star-outline" label="Rating" value={(stats.rating || 0).toFixed(1)} />
          </View>

          <SectionTitle title="Activity (7d)" />
          <Card>
            {hasChart ? (
              <LineChart
                data={{ labels, datasets: [{ data: values }] }}
                width={width}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={{ borderRadius: 14 }}
                withInnerLines
              />
            ) : (
              <Text style={{ color: colors.txt3, fontSize: 13, textAlign: 'center', paddingVertical: 30 }}>
                Not enough data yet
              </Text>
            )}
          </Card>

          <SectionTitle title="Conversion" />
          <Card>
            <Row colors={colors} label={isFreelancer ? 'Proposal win rate' : 'Job fill rate'} value={`${(stats.winRate || 0).toFixed(0)}%`} />
            <Row colors={colors} label="On-time delivery" value={`${(stats.onTimeRate || 0).toFixed(0)}%`} />
            <Row colors={colors} label="Response time" value={`${stats.avgResponseHours || 0}h`} last />
          </Card>
        </>
      )}
    </Screen>
  );
};

const StatCard = ({ icon, label, value, colors }) => (
  <View style={{ width: '48%' }}>
    <Card style={{ padding: 14 }}>
      <Ionicons name={icon} size={18} color={colors.primary2} />
      <Text style={{ color: colors.txt, fontSize: 20, fontWeight: '800', marginTop: 8 }}>{value}</Text>
      <Text style={{ color: colors.txt3, fontSize: 11, fontWeight: '600', marginTop: 2 }}>{label}</Text>
    </Card>
  </View>
);

const Row = ({ label, value, colors, last }) => (
  <View style={[styles.row, !last && { borderBottomColor: colors.b1, borderBottomWidth: 1 }]}>
    <Text style={{ color: colors.txt2, fontSize: 13 }}>{label}</Text>
    <Text style={{ color: colors.txt, fontSize: 14, fontWeight: '800' }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
});

export default Analytics;
