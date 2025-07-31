import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Colors } from '../../../themes/colors.js';

import { UserContext } from '../../../context/UserContext.js';
import { buildApiUrl } from '../../../config/api.js';

export default function DatosScreenSecurity() {
  const { user } = useContext(UserContext);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Si no hay usuario, mostrar mensaje de carga
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  // Construir el nombre completo
  const fullName = `${user.name} ${user.paternalSurname} ${user.maternalSurname}`;

  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña actual');
      return;
    }
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Por favor ingresa la nueva contraseña');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('/api/users/change-password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
          {
            text: 'OK',
            onPress: () => {
              setShowPasswordForm(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }
          }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const cancelPasswordChange = () => {
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Datos personales</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{user.name}</Text>
      </View>
      
      <DataField label="Nombre completo" value={fullName} />
      <DataField label="Correo electrónico" value={user.email} />
      <DataField label="Teléfono" value={user.phoneNumber} />
      {user.housingUnit && (
        <DataField label="Unidad habitacional" value={user.housingUnit} />
      )}
      <DataField label="Estado" value={user.state ? 'Activo' : 'Inactivo'} />
      
      {/* Sección de contraseña */}
      <View style={styles.passwordSection}>
        <Text style={styles.sectionTitle}>Contraseña</Text>
        
        {!showPasswordForm ? (
          <View style={styles.passwordDisplay}>
            <DataField label="Contraseña" value="**********" isPassword />
            <TouchableOpacity 
              style={styles.changePasswordButton}
              onPress={() => setShowPasswordForm(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.changePasswordText}>Cambiar contraseña</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.passwordForm}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Contraseña actual</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor={Colors.gray}
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Ingresa la nueva contraseña"
                placeholderTextColor={Colors.gray}
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Confirmar nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirma la nueva contraseña"
                placeholderTextColor={Colors.gray}
              />
            </View>
            
            <View style={styles.passwordActions}>
              <TouchableOpacity 
                style={[styles.passwordButton, styles.cancelButton]}
                onPress={cancelPasswordChange}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.passwordButton, styles.saveButton, loading && styles.disabledButton]}
                onPress={handleChangePassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      
      {/* Espacio adicional al final para evitar que el contenido se corte */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const DataField = ({ label, value, isPassword = false }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.dataInput}
        value={value}
        editable={false}
        secureTextEntry={isPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espacio adicional para evitar que se corte el contenido
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.title,
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  dataInput: {
    height: 45,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.card,
    elevation: 1,
  },
  input: {
    height: 45,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.card,
    elevation: 1,
  },
  passwordSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  passwordDisplay: {
    marginBottom: 15,
  },
  changePasswordButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  changePasswordText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  passwordForm: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  passwordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 12,
  },
  passwordButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: Colors.grayLight,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.gray,
    opacity: 0.7,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 80, // Espacio adicional al final
  },
});

