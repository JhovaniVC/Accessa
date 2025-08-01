import React, { useState, useContext, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Colors } from '../../themes/colors';
import Picker from '../../components/Picker';
import ImageSelector from '../../components/ImageSelector';
import { UserContext } from '../../context/UserContext';
import { buildApiUrl } from '../../config/api';

export default function ScreenReportesResident({ navigation }) {
  const [tipoProblema, setTipoProblema] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const { user } = useContext(UserContext);
  const imageSelectorRef = useRef();

  const handleImageSelected = (uri) => {
    setImagen(uri);
  };

  const limpiarFormulario = () => {
    setTipoProblema(null);
    setUbicacion(null);
    setDescripcion('');
    setImagen(null);
    if (imageSelectorRef.current && imageSelectorRef.current.reset) {
      imageSelectorRef.current.reset();
    }
  };

  const handleEnviarReporte = async () => {
    if (!descripcion || !tipoProblema || !ubicacion) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios.');
      return;
    }
    try {
      let body;
      let headers = {};
      if (imagen) {
        body = new FormData();
        body.append('description', descripcion);
        body.append('problemType', tipoProblema);
        body.append('problemLocation', ubicacion);
        body.append('userId', user?._id);
        body.append('image', {
          uri: imagen,
          name: 'evidencia.jpg',
          type: 'image/jpeg',
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        body = JSON.stringify({
          description: descripcion,
          problemType: tipoProblema,
          problemLocation: ubicacion,
          userId: user?._id,
        });
        headers['Content-Type'] = 'application/json';
      }
      console.log('Enviando reporte con datos:', { descripcion, tipoProblema, ubicacion, userId: user?._id });
      const response = await fetch(buildApiUrl('/api/reports'), {
        method: 'POST',
        headers,
        body,
      });
      console.log('Respuesta del servidor:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Reporte creado exitosamente:', result);
        Alert.alert('Éxito', '¡Reporte enviado correctamente!');
        limpiarFormulario();
      } else {
        const data = await response.json();
        console.log('Error del servidor:', data);
        Alert.alert('Error', data.message || 'No se pudo enviar el reporte');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Crear Nuevo Reporte</Text>
        
        <TouchableOpacity 
          style={styles.viewHistoryButton}
          onPress={() => navigation.navigate('ReportHistory')}
        >
          <Text style={styles.viewHistoryButtonText}>Ver mi historial de reportes</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo de problema *</Text>
          <Picker
            selectedValue={tipoProblema}
            onValueChange={setTipoProblema}
            items={[
              { label: 'Selecciona un tipo', value: null },
              { label: 'Mantenimiento', value: 'Mantenimiento' },
              { label: 'Seguridad', value: 'Seguridad' },
              { label: 'Limpieza', value: 'Limpieza' },
              { label: 'Ruido', value: 'Ruido' },
              { label: 'Vandalismo', value: 'Vandalismo' },
              { label: 'Robo', value: 'Robo' },
              { label: 'Accidente', value: 'Accidente' },
              { label: 'Otro', value: 'Otro' },
            ]}
            placeholder="Selecciona el tipo de problema"
          />

          <Text style={styles.label}>Ubicación *</Text>
          <Picker
            selectedValue={ubicacion}
            onValueChange={setUbicacion}
            items={[
              { label: 'Selecciona una ubicación', value: null },
              { label: 'Área común', value: 'Área común' },
              { label: 'Estacionamiento', value: 'Estacionamiento' },
              { label: 'Jardín', value: 'Jardín' },
              { label: 'Pasillo', value: 'Pasillo' },
              { label: 'Elevador', value: 'Elevador' },
              { label: 'Edificio A', value: 'Edificio A' },
              { label: 'Calle 2', value: 'Calle 2' },
              { label: 'Otro', value: 'Otro' },
            ]}
            placeholder="Selecciona la ubicación"
          />

          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe el problema en detalle..."
            placeholderTextColor={Colors.textSecondary}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Evidencia (opcional)</Text>
          <ImageSelector
            ref={imageSelectorRef}
            onImageSelected={handleImageSelected}
            selectedImage={imagen}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (!descripcion || !tipoProblema || !ubicacion) && styles.submitButtonDisabled]} 
          onPress={handleEnviarReporte}
          disabled={!descripcion || !tipoProblema || !ubicacion}
        >
          <Text style={styles.submitButtonText}>Enviar Reporte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 60,
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
  viewHistoryButton: {
    backgroundColor: Colors.highlight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  viewHistoryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.card,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray,
    opacity: 0.7,
  },
}); 