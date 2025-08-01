import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors } from '../../themes/colors';
import { UserContext } from '../../context/UserContext';
import { buildApiUrl } from '../../config/api';

export default function BitacoraScreen() {
  const { user } = useContext(UserContext);
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [contacto, setContacto] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [contactoValido, setContactoValido] = useState(true);

  // Función para formatear fecha y hora
  const formatDateTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'p.m' : 'a.m';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${formattedHours}:${formattedMinutes} ${ampm} - ${day}/${month}/${year}`;
  };

  // Actualizar fecha y hora cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  // Función para validar formato de teléfono
  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
    return phoneRegex.test(phone.trim());
  };

  // Función para validar formato de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Función para validar contacto (teléfono o email)
  const isValidContact = (contact) => {
    if (!contact || contact.trim() === '') return true; // Opcional, puede estar vacío
    return isValidPhone(contact) || isValidEmail(contact);
  };

  // Función para manejar cambios en el campo contacto
  const handleContactoChange = (text) => {
    setContacto(text);
    if (text.trim() === '') {
      setContactoValido(true); // Vacío es válido (opcional)
    } else {
      setContactoValido(isValidContact(text));
    }
  };

  const handleGuardar = async () => {
    if (!motivo || !descripcion) {
      Alert.alert('Campos requeridos', 'Motivo y descripción son obligatorios.');
      return;
    }

    if (!user?._id) {
      Alert.alert('Error', 'No hay usuario logueado');
      return;
    }

    // Validar formato de contacto si no está vacío
    if (contacto.trim() !== '' && !isValidContact(contacto)) {
      Alert.alert(
        'Formato de contacto inválido', 
        'El contacto debe ser un número de teléfono válido (8-15 dígitos) o un correo electrónico válido.'
      );
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Guardando registro de bitácora');
      console.log('🔗 URL:', buildApiUrl('/api/bitacora'));
      
      const response = await fetch(buildApiUrl('/api/bitacora'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          motivo: motivo.trim(),
          descripcion: descripcion.trim(),
          informacionAdicional: extraInfo.trim(),
          contacto: isValidContact(contacto) ? contacto.trim() : '',
          tipo: 'general'
          // La fecha y hora se tomarán automáticamente en el backend
        }),
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Registro guardado exitosamente:', data);
        
        Alert.alert(
          '✅ ¡Guardado Exitoso!', 
          'El registro de bitácora ha sido guardado correctamente.',
          [
            {
              text: 'OK',
              onPress: () => {
                setMotivo('');
                setDescripcion('');
                setExtraInfo('');
                setContacto('');
              }
            }
          ]
        );
      } else {
        console.error('❌ Error en respuesta:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('📄 Contenido del error:', errorText);
        Alert.alert('Error', 'No se pudo guardar el registro de bitácora');
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Registrar en la bitácora</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Fecha y hora:</Text>
          <Text style={styles.subtext}>{formatDateTime(currentDateTime)}</Text>

          <Text style={styles.label}>Motivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Motivo"
            placeholderTextColor={Colors.textSecondary}
            value={motivo}
            onChangeText={setMotivo}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción detallada"
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <Text style={styles.label}>Información a resaltar (opcional)</Text>
          <TextInput
             style={[styles.input, styles.textArea]}
            placeholder="Informacion resaltante"
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={4}
            value={extraInfo}
            onChangeText={setExtraInfo}
          />

          <Text style={styles.label}>Contacto (opcional)</Text>
          <TextInput
            style={[styles.input, !contactoValido && styles.inputError]}
            placeholder="Teléfono o email"
            placeholderTextColor={Colors.textSecondary}
            value={contacto}
            onChangeText={handleContactoChange}
            keyboardType="email-address"
          />
          {!contactoValido && contacto.trim() !== '' && (
            <Text style={styles.errorText}>
              Formato inválido. Ingresa un teléfono (8-15 dígitos) o email válido.
            </Text>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleGuardar}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  subtext: {
    color: Colors.textSecondary,
    marginBottom: 16,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    padding: 14,
    marginBottom: 20,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 60,
  },
  submitButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.6,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    fontStyle: 'italic',
  },
}); 