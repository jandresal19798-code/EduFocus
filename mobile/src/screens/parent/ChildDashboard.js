import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { parentAPI } from '../../services/api';

const ChildDashboard = ({ route }) => {
  const { colors } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const childId = route?.params?.childId;

  useEffect(() => {
    loadData();
  }, [childId]);

  const loadData = async () => {
    try {
      const response = await parentAPI.getChildProgress(childId || 'default', 30);
      setData(response.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Cargando...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No hay datos disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Panel de Padres</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Progreso de {data.overview.name}
        </Text>
      </View>

      <View style={styles.overviewCard}>
        <View style={styles.overviewRow}>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewValue, { color: colors.primary }]}>{data.overview.level}</Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Nivel</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewValue, { color: colors.warning }]}>{data.overview.streak}</Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Días Racha</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewValue, { color: colors.success }]}>{data.overview.totalXP}</Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>XP Total</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Estadísticas (30 días)</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {Math.round(data.stats.totalTimeMinutes / 60)}h
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tiempo Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>{data.stats.tasksCompleted}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tareas</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.warning }]}>{data.stats.studyDays}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Días Estudio</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Dominio por Materia</Text>
        {data.subjects.map((subject) => (
          <View key={subject.subject} style={[styles.subjectCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.subjectName, { color: colors.text }]}>{subject.subject}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${subject.avgMastery}%`,
                    backgroundColor: subject.avgMastery >= 70 ? colors.success : subject.avgMastery >= 40 ? colors.warning : colors.error
                  }
                ]} 
              />
            </View>
            <Text style={[styles.subjectPercent, { color: colors.textSecondary }]}>{subject.avgMastery}%</Text>
          </View>
        ))}
      </View>

      {data.difficulties.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>⚠️ Áreas de Atención</Text>
          {data.difficulties.map((diff, index) => (
            <View key={index} style={[styles.difficultyCard, { backgroundColor: colors.error + '15' }]}>
              <Text style={[styles.difficultyTopic, { color: colors.text }]}>{diff.topic}</Text>
              <Text style={[styles.difficultySubject, { color: colors.textSecondary }]}>
                {diff.subject} • Dominio: {diff.avgMastery}%
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Actividad Reciente</Text>
        {data.recentActivity.slice(0, 5).map((activity, index) => (
          <View key={index} style={[styles.activityCard, { backgroundColor: colors.surface }]}>
            <View style={[
              styles.activityIcon, 
              { backgroundColor: activity.type === 'study' ? colors.primary + '20' : colors.success + '20' }
            ]}>
              <Text style={styles.activityIconText}>
                {activity.type === 'study' ? '📚' : '✅'}
              </Text>
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                {activity.type === 'study' ? `${activity.subject} - ${activity.duration}min` : activity.title}
              </Text>
              <Text style={[styles.activityDate, { color: colors.textSecondary }]}>
                {new Date(activity.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16 },
  overviewCard: { borderRadius: 16, padding: 20, marginBottom: 24 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-around' },
  overviewItem: { alignItems: 'center' },
  overviewValue: { fontSize: 32, fontWeight: 'bold' },
  overviewLabel: { fontSize: 14, marginTop: 4 },
  statsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  section: { marginBottom: 24 },
  subjectCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 16, marginBottom: 8 },
  subjectName: { width: 100, fontSize: 14, fontWeight: '500' },
  progressBar: { flex: 1, height: 8, backgroundColor: 'rgba(158,158,158,0.3)', borderRadius: 4, marginHorizontal: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  subjectPercent: { width: 40, textAlign: 'right', fontSize: 14, fontWeight: '500' },
  difficultyCard: { borderRadius: 12, padding: 16, marginBottom: 8 },
  difficultyTopic: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  difficultySubject: { fontSize: 14 },
  activityCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, marginBottom: 8 },
  activityIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  activityIconText: { fontSize: 20 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  activityDate: { fontSize: 12 }
});

export default ChildDashboard;
