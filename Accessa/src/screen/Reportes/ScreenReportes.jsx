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
import { Colors } from '../../themes/colors';
import Picker from '../../components/Picker';
import ImageSelector from '../../components/ImageSelector';
import { UserContext } from '../../context/UserContext';
import { buildApiUrl } from '../../config/api';

export default function ScreenReportes() {
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
            <TouchableOpacity style={styles.attachmentButton} activeOpacity={0.7}>
              <ImageSelector onImageSelected={handleImageSelected} ref={imageSelectorRef} />
            </TouchableOpacity>
            {imagen && (
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Image source={{ uri: imagen }} style={{ width: 200, height: 150, borderRadius: 10, marginBottom: 6 }} />
                <TouchableOpacity onPress={() => setImagen(null)}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>Eliminar imagen</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleEnviarReporte}>
          <Text style={styles.submitButtonText}>Enviar Reporte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    marginBottom:40
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    color: Colors.textPrimary,
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
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  selector: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.card,
    padding: 14,
  },
  selectorText: {
    fontSize: 15,
    color: Colors.gray,
  },
  attachmentButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderStyle: 'dashed',
    backgroundColor: Colors.highlight,
  },
  attachmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
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
    marginBottom:100
  },
  submitButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});