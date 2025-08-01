import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../../context/UserContext';
import { buildApiUrl } from '../../../config/api';

export default function ScreenLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user); // Guardar usuario en contexto
        Alert.alert('Éxito', '¡Login exitoso!');
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Error', data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://thumbs.dreamstime.com/b/edificios-de-highrise-verticales-2733509.jpg', }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#ffffff"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Button title={loading ? 'Cargando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 30,
    borderRadius: 20,
    width: '85%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: '#2A7EEA',
    color: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 18,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color: '#2A7EEA',
    fontSize: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
