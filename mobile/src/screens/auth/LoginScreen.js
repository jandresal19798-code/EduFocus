import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import useAuthStore from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      login(response.data.user, response.data.token);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>EduFocus</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Tu asistente de estudio inteligente
          </Text>
        </View>

        <View style={[styles.form, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="tu@email.com"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="••••••••"
            placeholderTextColor={colors.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 42, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16 },
  form: { borderRadius: 16, padding: 24, shadowRadius: 8, elevation: 3 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    borderWidth: 1 
  },
  button: { 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
    marginTop: 24 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  linkButton: { alignItems: 'center', marginTop: 16 },
  linkText: { fontSize: 14 }
});

export default LoginScreen;
