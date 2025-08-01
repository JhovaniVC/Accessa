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
import { Colors } from '../../themes/colors';

export default function BitacoraAccesosScreen() {
  const [visitante, setVisitante] = useState('');
  const [motivo, setMotivo] = useState('');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const handleGuardar = () => {
    if (!visitante || !motivo) {
      Alert.alert('Campos requeridos', 'Visitante y motivo son obligatorios.');
      return;
    }

    Alert.alert('Guardado', '¡Registro de acceso guardado!');
    setVisitante('');
    setMotivo('');
    setHoraEntrada('');
    setHoraSalida('');
    setObservaciones('');
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Registro de Acceso</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.subtext}>16/06/25</Text>

          <Text style={styles.label}>Nombre del visitante</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo del visitante"
            placeholderTextColor={Colors.textSecondary}
            value={visitante}
            onChangeText={setVisitante}
          />

          <Text style={styles.label}>Motivo de la visita</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Motivo de la visita"
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
            value={motivo}
            onChangeText={setMotivo}
          />

          <Text style={styles.label}>Hora de entrada</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor={Colors.textSecondary}
            value={horaEntrada}
            onChangeText={setHoraEntrada}
          />

          <Text style={styles.label}>Hora de salida (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor={Colors.textSecondary}
            value={horaSalida}
            onChangeText={setHoraSalida}
          />

          <Text style={styles.label}>Observaciones (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observaciones adicionales"
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
            value={observaciones}
            onChangeText={setObservaciones}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleGuardar}>
          <Text style={styles.submitButtonText}>Guardar registro</Text>
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
    minHeight: 80,
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