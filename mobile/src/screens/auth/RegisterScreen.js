import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import useAuthStore from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    role: 'STUDENT',
    parentalConsent: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.birthDate) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const birth = new Date(formData.birthDate);
    const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    if (age < 8 || age > 18) {
      Alert.alert('Error', 'Debes tener entre 8 y 18 años');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        ...formData,
        ageGroup: age < 13 ? 'CHILD' : 'TEENAGER'
      });
      login(response.data.user, response.data.token);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Error al registrar');
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
          <Text style={[styles.title, { color: colors.primary }]}>Crear Cuenta</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Únete a EduFocus hoy mismo
          </Text>
        </View>

        <View style={[styles.form, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="tu@email.com"
            placeholderTextColor={colors.gray}
            value={formData.email}
            onChangeText={(v) => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.text }]}>Fecha de Nacimiento *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.gray}
            value={formData.birthDate}
            onChangeText={(v) => handleChange('birthDate', v)}
          />

          <Text style={[styles.label, { color: colors.text }]}>Contraseña *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="••••••••"
            placeholderTextColor={colors.gray}
            value={formData.password}
            onChangeText={(v) => handleChange('password', v)}
            secureTextEntry
          />

          <Text style={[styles.label, { color: colors.text }]}>Confirmar Contraseña *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="••••••••"
            placeholderTextColor={colors.gray}
            value={formData.confirmPassword}
            onChangeText={(v) => handleChange('confirmPassword', v)}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creando...' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              ¿Ya tienes cuenta? Inicia Sesión
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
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
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

export default RegisterScreen;
