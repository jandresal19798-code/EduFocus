import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { userAPI, taskAPI, progressAPI } from '../../services/api';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, tasksRes, weeklyRes] = await Promise.all([
        userAPI.getStats(),
        taskAPI.getTasks({ status: 'pending' }),
        progressAPI.getWeekly()
      ]);
      setStats(statsRes.data);
      setTasks(tasksRes.data.tasks.slice(0, 5));
      setWeeklyData(weeklyRes.data.weekData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          ¡Hola! 👋
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {stats?.gamification?.streak > 0 
            ? `${stats.gamification.streak} días de racha 🔥`
            : 'Listo para aprender hoy'}
        </Text>
      </View>

      {stats?.gamification && (
        <View style={[styles.levelCard, { backgroundColor: colors.primary }]}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Nivel {stats.gamification.level}</Text>
            <Text style={styles.xpText}>{stats.gamification.currentXP} XP</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${stats.gamification.xpProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{stats.gamification.xpProgress}% para el siguiente nivel</Text>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {stats?.tasksCompleted || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tareas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {Math.round((stats?.totalMinutesThisMonth || 0) / 60)}h
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Este mes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statValue, { color: colors.secondary }]}>
            {stats?.weekSessions || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sesiones</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tareas Pendientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Planner')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        
        {tasks.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
            ¡Sin tareas pendientes! 🎉
          </Text>
        ) : (
          tasks.map((task, index) => (
            <TouchableOpacity 
              key={task.id} 
              style={[styles.taskCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('Planner')}
            >
              <View style={styles.taskIcon}>
                <Text style={styles.taskIconText}>
                  {task.subject?.charAt(0) || 'T'}
                </Text>
              </View>
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, { color: colors.text }]} numberOfLines={1}>
                  {task.title}
                </Text>
                <Text style={[styles.taskMeta, { color: colors.textSecondary }]}>
                  {task.subject} • {task.estimatedMinutes} min
                </Text>
              </View>
              <View style={[
                styles.priorityBadge, 
                { backgroundColor: task.difficulty >= 4 ? colors.error : colors.success }
              ]}>
                <Text style={styles.priorityText}>
                  {task.difficulty >= 4 ? 'Difícil' : 'Fácil'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Esta Semana</Text>
        <View style={styles.weekChart}>
          {weeklyData.map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <View style={[styles.dayBar, { height: Math.min(day.totalTime / 5, 100) }]} />
              <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16 },
  levelCard: { borderRadius: 16, padding: 20, marginBottom: 20 },
  levelInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  levelText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  xpText: { color: '#FFFFFF', fontSize: 16, opacity: 0.9 },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 4 },
  progressText: { color: '#FFFFFF', fontSize: 12, marginTop: 8, opacity: 0.9 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  seeAll: { fontSize: 14 },
  taskCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 16, marginBottom: 12 },
  taskIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  taskIconText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  taskMeta: { fontSize: 12 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  weekChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100, paddingHorizontal: 10 },
  dayColumn: { alignItems: 'center', flex: 1 },
  dayBar: { width: 20, backgroundColor: '#5C6BC0', borderRadius: 4, marginBottom: 8 },
  dayLabel: { fontSize: 12 }
});

export default HomeScreen;
