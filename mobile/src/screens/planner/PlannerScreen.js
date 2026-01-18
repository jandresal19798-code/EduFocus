import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { taskAPI } from '../../services/api';
import dayjs from 'dayjs';

const PlannerScreen = () => {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    estimatedMinutes: 30,
    difficulty: 3
  });
  const [newPlan, setNewPlan] = useState({
    projectTitle: '',
    subject: '',
    deadline: '',
    totalEstimatedHours: 5
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getTasks({});
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.subject) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }
    
    try {
      await taskAPI.createTask(newTask);
      setNewTask({ title: '', subject: '', estimatedMinutes: 30, difficulty: 3 });
      setShowAddModal(false);
      loadTasks();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la tarea');
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      await taskAPI.updateTask(taskId, { isCompleted: !currentStatus });
      loadTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const generatePlan = async () => {
    if (!newPlan.projectTitle || !newPlan.deadline) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    try {
      await taskAPI.generatePlan(newPlan);
      setNewPlan({ projectTitle: '', subject: '', deadline: '', totalEstimatedHours: 5 });
      setShowPlanModal(false);
      loadTasks();
      Alert.alert('Éxito', 'Plan generado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el plan');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.isCompleted;
    if (filter === 'pending') return !task.isCompleted;
    return true;
  });

  const pendingTasks = filteredTasks.filter(t => !t.isCompleted);
  const completedTasks = filteredTasks.filter(t => t.isCompleted);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Planificador</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Organiza tu estudio
        </Text>
      </View>

      <View style={styles.filterRow}>
        {['all', 'pending', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              { backgroundColor: filter === f ? colors.primary : colors.surface }
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === f ? '#FFFFFF' : colors.text }
            ]}>
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.tasksContainer} contentContainerStyle={styles.tasksContent}>
        {pendingTasks.length > 0 && (
          <View style={styles.taskSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Pendientes ({pendingTasks.length})
            </Text>
            {pendingTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                colors={colors}
                onToggle={() => toggleTask(task.id, task.isCompleted)}
              />
            ))}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.taskSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Completadas ({completedTasks.length})
            </Text>
            {completedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                colors={colors}
                onToggle={() => toggleTask(task.id, task.isCompleted)}
              />
            ))}
          </View>
        )}

        {filteredTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {filter === 'all' ? 'No tienes tareas aún' : 'No hay tareas en esta categoría'}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.secondary }]}
          onPress={() => setShowPlanModal(true)}
        >
          <Text style={styles.fabIcon}>📅</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nueva Tarea</Text>
            
            <Text style={[styles.label, { color: colors.text }]}>Título *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="¿Qué tienes que hacer?"
              placeholderTextColor={colors.gray}
              value={newTask.title}
              onChangeText={(v) => setNewTask(prev => ({ ...prev, title: v }))}
            />

            <Text style={[styles.label, { color: colors.text }]}>Materia *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Matemáticas, Física..."
              placeholderTextColor={colors.gray}
              value={newTask.subject}
              onChangeText={(v) => setNewTask(prev => ({ ...prev, subject: v }))}
            />

            <Text style={[styles.label, { color: colors.text }]}>Tiempo estimado (minutos)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              keyboardType="numeric"
              value={String(newTask.estimatedMinutes)}
              onChangeText={(v) => setNewTask(prev => ({ ...prev, estimatedMinutes: parseInt(v) || 30 }))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.surface }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={addTask}
              >
                <Text style={styles.modalButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showPlanModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Generar Plan de Estudio</Text>
            
            <Text style={[styles.label, { color: colors.text }]}>Proyecto/Tema *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Examen de matemáticas..."
              placeholderTextColor={colors.gray}
              value={newPlan.projectTitle}
              onChangeText={(v) => setNewPlan(prev => ({ ...prev, projectTitle: v }))}
            />

            <Text style={[styles.label, { color: colors.text }]}>Materia</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Matemáticas"
              placeholderTextColor={colors.gray}
              value={newPlan.subject}
              onChangeText={(v) => setNewPlan(prev => ({ ...prev, subject: v }))}
            />

            <Text style={[styles.label, { color: colors.text }]}>Fecha límite *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.gray}
              value={newPlan.deadline}
              onChangeText={(v) => setNewPlan(prev => ({ ...prev, deadline: v }))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.surface }]}
                onPress={() => setShowPlanModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                onPress={generatePlan}
              >
                <Text style={styles.modalButtonText}>Generar Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const TaskCard = ({ task, colors, onToggle }) => (
  <TouchableOpacity 
    style={[styles.taskCard, { backgroundColor: colors.surface }]}
    onPress={onToggle}
  >
    <View style={styles.checkbox}>
      {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <View style={styles.taskInfo}>
      <Text style={[
        styles.taskTitle,
        { color: colors.text, textDecorationLine: task.isCompleted ? 'line-through' : 'none' }
      ]}>
        {task.title}
      </Text>
      <Text style={[styles.taskMeta, { color: colors.textSecondary }]}>
        {task.subject} • {task.estimatedMinutes}min
      </Text>
    </View>
    <View style={[
      styles.difficultyDot,
      { backgroundColor: task.difficulty >= 4 ? colors.error : task.difficulty >= 3 ? colors.warning : colors.success }
    ]} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterText: { fontSize: 14, fontWeight: '500' },
  tasksContainer: { flex: 1 },
  tasksContent: { paddingHorizontal: 20, paddingBottom: 100 },
  taskSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  taskCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 16, marginBottom: 8 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#5C6BC0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkmark: { color: '#5C6BC0', fontSize: 14, fontWeight: 'bold' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  taskMeta: { fontSize: 12 },
  difficultyDot: { width: 8, height: 8, borderRadius: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16 },
  fabContainer: { position: 'absolute', bottom: 20, right: 20, gap: 12 },
  fab: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowRadius: 8, elevation: 4 },
  fabIcon: { fontSize: 24, color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { borderRadius: 12, padding: 14, fontSize: 16 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalButton: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  modalButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' }
});

export default PlannerScreen;
