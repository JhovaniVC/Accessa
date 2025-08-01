import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors } from '../../../themes/colors';

export default function BitacoraScreen() {
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [contacto, setContacto] = useState('');

  const handleGuardar = () => {
    if (!motivo || !descripcion) {
      Alert.alert('Campos requeridos', 'Motivo y descripción son obligatorios.');
      return;
    }

    Alert.alert('Guardado', '¡Los cambios han sido guardados!');
    setMotivo('');
    setDescripcion('');
    setExtraInfo('');
    setContacto('');
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
          <Text style={styles.subtext}>09:10 a.m - 16/06/25</Text>

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
            value={descripcion}
            onChangeText={setExtraInfo}
          />

          <Text style={styles.label}>Contacto (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Teléfono o email"
            placeholderTextColor={Colors.textSecondary}
            value={contacto}
            onChangeText={setContacto}
          />
        </View>

        

        <TouchableOpacity style={styles.submitButton} onPress={handleGuardar}>
          <Text style={styles.submitButtonText}>Guardar cambios</Text>
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
});
