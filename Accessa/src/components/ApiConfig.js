import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../themes/colors';
import { setApiBaseUrl, getCurrentApiUrl, initializeApiConfig } from '../config/api';

export default function ApiConfig() {
  const [ipAddress, setIpAddress] = useState('172.16.52.86');
  const [port, setPort] = useState('3000');
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(getCurrentApiUrl());
  }, []);

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    try {
      const detectedIP = await initializeApiConfig();
      const url = new URL(detectedIP);
      setIpAddress(url.hostname);
      setPort(url.port || '3000');
      setCurrentUrl(detectedIP);
      Alert.alert('Detección Exitosa', `Servidor encontrado en: ${detectedIP}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo detectar automáticamente el servidor');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSaveConfig = () => {
    if (!ipAddress || !port) {
      Alert.alert('Error', 'Por favor completa la IP y puerto');
      return;
    }

    const newBaseUrl = `http://${ipAddress}:${port}`;
    setApiBaseUrl(newBaseUrl);
    setCurrentUrl(newBaseUrl);
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
      <Text style={styles.subtitle}>Detección automática o configuración manual</Text>
      
      <TouchableOpacity style={styles.autoDetectButton} onPress={handleAutoDetect} disabled={isDetecting}>
        {isDetecting ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.buttonText}>Detectando...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>🔍 Detectar Automáticamente</Text>
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dirección IP:</Text>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="172.16.52.86"
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
        URL actual: {currentUrl}
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
  autoDetectButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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