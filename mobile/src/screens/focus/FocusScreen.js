import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { focusAPI } from '../../services/api';

const FocusScreen = () => {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionId, setSessionId] = useState(null);
  const [pomodoroId, setPomodoroId] = useState(null);
  const [focusDuration, setFocusDuration] = useState(25);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = async () => {
    try {
      const response = await focusAPI.startSession({
        subject: 'Estudio',
        duration: focusDuration
      });
      setSessionId(response.data.sessionId);
      setPomodoroId(response.data.pomodoroId);
      setTimeLeft(response.data.focusDuration);
      setIsActive(true);
      setIsBreak(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar la sesión');
    }
  };

  const completeSession = async () => {
    try {
      await focusAPI.completeSession(sessionId, {
        pomodoroId,
        completed: true,
        type: isBreak ? 'BREAK' : 'FOCUS',
        startTime: new Date(Date.now() - (isBreak ? 5 : focusDuration) * 60 * 1000)
      });
      
      if (!isBreak) {
        setCompletedPomodoros(prev => prev + 1);
        await startBreak();
      } else {
        setIsActive(false);
        setIsBreak(false);
        setSessionId(null);
        setPomodoroId(null);
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const startBreak = async () => {
    try {
      const response = await focusAPI.takeBreak(sessionId, null);
      setPomodoroId(response.data.pomodoroId);
      setTimeLeft(response.data.breakDuration);
      setIsBreak(true);
    } catch (error) {
      console.error('Error starting break:', error);
    }
  };

  const skipSession = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsActive(false);
    setIsBreak(false);
    setSessionId(null);
    setPomodoroId(null);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            Vibration.vibrate([0, 500, 200, 500]);
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  if (!isActive) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Modo Focus</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Concentración profunda
          </Text>
        </View>

        <View style={styles.timerPreview}>
          <View style={[styles.circle, { borderColor: colors.primary }]}>
            <Text style={[styles.previewTime, { color: colors.primary }]}>
              {formatTime(focusDuration * 60)}
            </Text>
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
              minutos de focus
            </Text>
          </View>
        </View>

        <View style={styles.settings}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Duración del Pomodoro</Text>
          <View style={styles.durationOptions}>
            {[15, 25, 45].map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationOption,
                  { 
                    backgroundColor: focusDuration === duration ? colors.primary : colors.surface,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => setFocusDuration(duration)}
              >
                <Text style={[
                  styles.durationText,
                  { color: focusDuration === duration ? '#FFFFFF' : colors.text }
                ]}>
                  {duration}min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Técnica Pomodoro</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Alterna entre períodos de concentración intensa y descansos breves para maximizar tu productividad.
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={startSession}
        >
          <Text style={styles.startButtonText}>Comenzar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isBreak ? colors.success + '20' : colors.background }]}>
      <View style={styles.activeHeader}>
        <Text style={[styles.statusText, { color: isBreak ? colors.success : colors.primary }]}>
          {isBreak ? '☕ Descanso' : '🎯 En Focalización'}
        </Text>
        <Text style={[styles.pomodoroCount, { color: colors.textSecondary }]}>
          Pomodoros completados: {completedPomodoros}
        </Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={[
          styles.timerCircle,
          { 
            borderColor: isBreak ? colors.success : colors.primary,
            backgroundColor: colors.surface
          }
        ]}>
          <Text style={[
            styles.timerText,
            { color: isBreak ? colors.success : colors.primary }
          ]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: colors.surface }]}
          onPress={skipSession}
        >
          <Text style={[styles.controlText, { color: colors.error }]}>Saltar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.controlButton, 
            { backgroundColor: isBreak ? colors.success : colors.primary }
          ]}
          onPress={completeSession}
        >
          <Text style={styles.completeButtonText}>
            {isBreak ? 'Terminar Descanso' : 'Completar'}
          </Text>
        </TouchableOpacity>
      </View>

      {isBreak && (
        <View style={styles.breakTips}>
          <Text style={[styles.breakTip, { color: colors.textSecondary }]}>
            💡 stretch, hydrate, look away from screens
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16 },
  timerPreview: { alignItems: 'center', marginBottom: 40 },
  circle: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  previewTime: { fontSize: 48, fontWeight: 'bold' },
  previewLabel: { fontSize: 14, marginTop: 8 },
  settings: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  durationOptions: { flexDirection: 'row', justifyContent: 'center' },
  durationOption: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginHorizontal: 8, borderWidth: 1 },
  durationText: { fontSize: 16, fontWeight: '500' },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24 },
  infoTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  infoText: { fontSize: 14, lineHeight: 20 },
  startButton: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  startButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  activeHeader: { alignItems: 'center', marginTop: 40, marginBottom: 60 },
  statusText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  pomodoroCount: { fontSize: 14 },
  timerContainer: { alignItems: 'center', marginBottom: 60 },
  timerCircle: { width: 260, height: 260, borderRadius: 130, borderWidth: 6, justifyContent: 'center', alignItems: 'center' },
  timerText: { fontSize: 72, fontWeight: 'bold' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  controlButton: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  controlText: { fontSize: 16, fontWeight: '600' },
  completeButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  breakTips: { alignItems: 'center', marginTop: 40 },
  breakTip: { fontSize: 14 }
});

export default FocusScreen;
