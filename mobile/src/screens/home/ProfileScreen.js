import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import useAuthStore from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';

const ProfileScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout, updateUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await userAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getAgeGroupLabel = (ageGroup) => {
    if (ageGroup === 'CHILD') return '8-12 años';
    if (ageGroup === 'TEENAGER') return '13-18 años';
    return 'Usuario';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.displayName || 'Estudiante'}
        </Text>
        <Text style={[styles.ageGroup, { color: colors.textSecondary }]}>
          {getAgeGroupLabel(user?.ageGroup)}
        </Text>
      </View>

      {stats?.gamification && (
        <View style={[styles.levelCard, { backgroundColor: colors.primary }]}>
          <View style={styles.levelRow}>
            <View>
              <Text style={styles.levelLabel}>Nivel {stats.gamification.level}</Text>
              <Text style={styles.xpLabel}>{stats.gamification.currentXP} XP</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>🔥 {stats.gamification.streak}</Text>
            </View>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${stats.gamification.xpProgress}%` }]} />
          </View>
          <Text style={styles.xpNext}>{stats.gamification.xpProgress}% para siguiente nivel</Text>
        </View>
      )}

      <View style={[styles.statsGrid, { backgroundColor: colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>{stats?.tasksCompleted || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tareas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{Math.round((stats?.totalMinutesThisMonth || 0) / 60)}h</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Estudio</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.secondary }]}>{stats?.weekSessions || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sesiones</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Configuración</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tema</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
              {isDark ? 'Oscuro' : 'Claro'}
            </Text>
          </View>
          <View style={[styles.toggle, { backgroundColor: isDark ? colors.primary : colors.gray }]}>
            <View style={[styles.toggleKnob, { backgroundColor: '#FFFFFF' }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Notificaciones</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>Activadas</Text>
          </View>
          <View style={[styles.toggle, { backgroundColor: colors.success }]}>
            <View style={[styles.toggleKnob, { backgroundColor: '#FFFFFF', marginLeft: 20 }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tiempo de Pomodoro</Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>25 minutos</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: colors.error + '20' }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: colors.error }]}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.gray }]}>EduFocus v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', padding: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 40, color: '#FFFFFF', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  ageGroup: { fontSize: 16 },
  levelCard: { margin: 20, borderRadius: 16, padding: 20 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  levelLabel: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  xpLabel: { color: '#FFFFFF', fontSize: 14, opacity: 0.9 },
  levelBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  levelBadgeText: { color: '#FFFFFF', fontWeight: '600' },
  xpBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 4 },
  xpNext: { color: '#FFFFFF', fontSize: 12, marginTop: 8, opacity: 0.8 },
  statsGrid: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 16, padding: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  section: { margin: 20, borderRadius: 16, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16, marginBottom: 4 },
  settingValue: { fontSize: 14 },
  toggle: { width: 50, height: 28, borderRadius: 14, padding: 4 },
  toggleKnob: { width: 20, height: 20, borderRadius: 10 },
  logoutButton: { marginHorizontal: 20, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  logoutText: { fontSize: 16, fontWeight: '600' },
  version: { textAlign: 'center', marginTop: 20, marginBottom: 40, fontSize: 12 }
});

export default ProfileScreen;
