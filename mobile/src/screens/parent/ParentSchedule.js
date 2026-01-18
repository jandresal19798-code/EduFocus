import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { parentAPI } from '../../services/api';
import dayjs from 'dayjs';

const ParentSchedule = () => {
  const { colors } = useTheme();
  const [schedule, setSchedule] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const response = await parentAPI.getChildren();
      setChildren(response.data.children);
      if (response.data.children.length > 0) {
        setSelectedChild(response.data.children[0].id);
        loadSchedule(response.data.children[0].id);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async (childId) => {
    try {
      const response = await parentAPI.getChildSchedule(childId, 7);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const handleChildChange = (childId) => {
    setSelectedChild(childId);
    loadSchedule(childId);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Horario</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Próximos 7 días
        </Text>
      </View>

      {children.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childSelector}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={[
                styles.childChip,
                { 
                  backgroundColor: selectedChild === child.id ? colors.primary : colors.surface,
                  borderColor: colors.border
                }
              ]}
              onPress={() => handleChildChange(child.id)}
            >
              <Text style={[
                styles.childChipText,
                { color: selectedChild === child.id ? '#FFFFFF' : colors.text }
              ]}>
                {child.displayName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {schedule && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Proyectos Activos</Text>
            {schedule.projects.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Sin proyectos próximos
              </Text>
            ) : (
              schedule.projects.map((project) => (
                <View key={project.id} style={[styles.projectCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.projectHeader}>
                    <Text style={[styles.projectTitle, { color: colors.text }]}>{project.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: colors.warning }]}>
                      <Text style={styles.priorityText}>
                        {Math.round(project.progress * 100)}%
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.projectMeta, { color: colors.textSecondary }]}>
                    {project.subject} • Vence: {dayjs(project.deadline).format('DD/MM')}
                  </Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${project.progress * 100}%` }]} />
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tareas Próximas</Text>
            {schedule.upcomingTasks.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay tareas pendientes
              </Text>
            ) : (
              schedule.upcomingTasks.map((task) => (
                <View key={task.id} style={[styles.taskCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.taskIcon}>
                    <Text style={styles.taskIconText}>{task.subject.charAt(0)}</Text>
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
                    <Text style={[styles.taskMeta, { color: colors.textSecondary }]}>
                      {task.subject} • {task.dueDate ? dayjs(task.dueDate).format('DD/MM') : 'Sin fecha'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Plan de Estudio</Text>
            {schedule.studyPlan.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Sin sesiones programadas
              </Text>
            ) : (
              schedule.studyPlan.map((session, index) => (
                <View key={index} style={[styles.sessionCard, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.sessionDate, { color: colors.primary }]}>
                    {dayjs(session.date).format('dddd, DD/MM')}
                  </Text>
                  <Text style={[styles.sessionInfo, { color: colors.text }]}>
                    {session.subject} • {session.duration}min
                  </Text>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16 },
  childSelector: { marginBottom: 20, paddingHorizontal: 20 },
  childChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  childChipText: { fontSize: 14, fontWeight: '500' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  emptyText: { textAlign: 'center', padding: 20 },
  projectCard: { borderRadius: 12, padding: 16, marginBottom: 12 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  projectTitle: { fontSize: 16, fontWeight: '500', flex: 1, marginRight: 12 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  projectMeta: { fontSize: 12, marginBottom: 12 },
  progressBar: { height: 6, backgroundColor: 'rgba(158,158,158,0.3)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#5C6BC0', borderRadius: 3 },
  taskCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, marginBottom: 8 },
  taskIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#5C6BC0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  taskIconText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  taskMeta: { fontSize: 12 },
  sessionCard: { borderRadius: 12, padding: 16, marginBottom: 8 },
  sessionDate: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  sessionInfo: { fontSize: 14 }
});

export default ParentSchedule;
