import React, { useState, useContext, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image, // <-- Agrego esta línea
} from 'react-native';
import { Colors } from '../../../themes/colors';
import Picker from '../../../components/Picker';
import ImageSelector from '../../../components/ImageSelector';
import { UserContext } from '../../../context/UserContext';
import { buildApiUrl } from '../../../config/api';

export default function ScreenReportesSecurity() {
  const [tipoProblema, setTipoProblema] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null); // uri de la imagen
  const { user } = useContext(UserContext);
  // const usuario = user ? user.name : 'Usuario'; // Eliminado el saludo

  // Referencia al ImageSelector para resetearlo
  const imageSelectorRef = useRef();

  // Función para manejar la selección de imagen desde el hijo
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
        // Si hay imagen, usa FormData
        body = new FormData();
        body.append('description', descripcion);
        body.append('type', tipoProblema);
        body.append('location', ubicacion);
        body.append('userId', user?._id);
        body.append('image', {
          uri: imagen,
          name: 'evidencia.jpg',
          type: 'image/jpeg',
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // Si no hay imagen, envía JSON
        body = JSON.stringify({
          description: descripcion,
          type: tipoProblema,
          location: ubicacion,
          userId: user?._id,
        });
        headers['Content-Type'] = 'application/json';
      }
      const response = await fetch(buildApiUrl('/api/reports'), {
        method: 'POST',
        headers,
        body,
      });
      if (response.ok) {
        Alert.alert('Éxito', '¡Reporte enviado correctamente!');
        limpiarFormulario();
      } else {
        const data = await response.json();
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
        {/* <Text style={styles.title}>Hola, {usuario} 👋</Text> */}

<Text style={styles.sectionTitle}>Describa el problema a reportar</Text>  

<View style={styles.card}>
  <Text style={styles.label}>Descripción del problema:</Text>
  <TextInput
    style={styles.input}
    placeholder="Describe detalladamente el problema"
    placeholderTextColor={Colors.gray}
    multiline
    numberOfLines={4}
    value={descripcion}
    onChangeText={setDescripcion}
  />

  <Picker
    label="Tipo de problema"
    options={['Robo', 'Vandalismo', 'Accidente', 'Otro']}
    selectedValue={tipoProblema}
    onSelect={setTipoProblema}
  />

  <Picker
    label="Ubicación del incidente"
    options={['Calle 1', 'Calle 2', 'Edificio A', 'Otro']}
    selectedValue={ubicacion}
    onSelect={setUbicacion}
  />

  <View style={styles.fieldGroup}>
    <Text style={styles.label}>Adjuntar evidencia (opcional):</Text>
    <TouchableOpacity style={styles.attachmentButton} activeOpacity={0.8}>
      <ImageSelector onImageSelected={handleImageSelected} ref={imageSelectorRef} />
    </TouchableOpacity>

    {imagen && (
      <View style={styles.imagePreviewContainer}>
        <Image source={{ uri: imagen }} style={styles.previewImage} />
        <TouchableOpacity onPress={() => setImagen(null)}>
          <Text style={styles.removeImageText}>Eliminar imagen</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
</View>

<TouchableOpacity style={styles.submitButton} activeOpacity={0.9} onPress={handleEnviarReporte}>
  <Text style={styles.submitButtonText}>Enviar Reporte</Text>
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
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
    padding: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  attachmentButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderStyle: 'dashed',
    backgroundColor: Colors.highlight,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  previewImage: {
    width: 220,
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  removeImageText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
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
    marginTop: 10,
    marginBottom: 60,
  },
  submitButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
});
