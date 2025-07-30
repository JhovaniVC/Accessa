import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../themes/colors';
import { setApiBaseUrl, getCurrentApiUrl } from '../config/api';

export default function ApiConfig() {
  const [ipAddress, setIpAddress] = useState('192.168.1.225');
  const [port, setPort] = useState('3000');

  const handleSaveConfig = () => {
    if (!ipAddress || !port) {
      Alert.alert('Error', 'Por favor completa la IP y puerto');
      return;
    }

    const newBaseUrl = `http://${ipAddress}:${port}`;
    setApiBaseUrl(newBaseUrl);
    Alert.alert('Éxito', `API configurada en: ${newBaseUrl}`);
  };

  const handleTestConnection = async () => {
    const currentUrl = getCurrentApiUrl();
    try {
      const response = await fetch(currentUrl);
      if (response.ok) {
        Alert.alert('Conexión exitosa', 'El servidor responde correctamente');
      } else {
        Alert.alert('Error', 'El servidor no responde correctamente');
      }
    } catch (error) {
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de API</Text>
      <Text style={styles.subtitle}>Cambia la IP cuando cambies de red</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dirección IP:</Text>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="192.168.1.225"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Puerto:</Text>
        <TextInput
          style={styles.input}
          value={port}
          onChangeText={setPort}
          placeholder="3000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveConfig}>
          <Text style={styles.buttonText}>Guardar Configuración</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.testButton} onPress={handleTestConnection}>
          <Text style={styles.buttonText}>Probar Conexión</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.currentUrl}>
        URL actual: {getCurrentApiUrl()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.card,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  testButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  currentUrl: {
    marginTop: 20,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
}); 