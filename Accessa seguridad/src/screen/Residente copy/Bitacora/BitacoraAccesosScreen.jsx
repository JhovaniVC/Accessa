import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../../../themes/colors';
import { UserContext } from '../../../context/UserContext';
import { buildApiUrl } from '../../../config/api';

export default function BitacoraAccesosScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveredBy: '',
    courierCompany: '',
    department: '',
    receivedBy: '',
    description: '',
    status: 'entregado',
    comments: ''
  });

  // Debug: Mostrar estado actual del formulario
  const debugFormData = () => {
    console.log('Estado actual del formulario:', formData);
    console.log('Usuario actual:', user);
  };

  // Validar formulario
  const validateForm = () => {
    console.log('Validando formulario...', formData);
    
    if (!formData.deliveredBy.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre de quien entrega');
      return false;
    }
    if (!formData.courierCompany.trim()) {
      Alert.alert('Error', 'Por favor ingresa la empresa de paquetería');
      return false;
    }
    if (!formData.department.trim()) {
      Alert.alert('Error', 'Por favor ingresa el departamento');
      return false;
    }
    if (!formData.receivedBy.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre de quien recibe');
      return false;
    }
    
    console.log('Formulario válido');
    return true;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    console.log(`Cambiando ${field} a:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar registro
  const handleSave = async () => {
    debugFormData();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Verificar que tenemos un usuario
      if (!user) {
        Alert.alert('Error', 'No hay usuario autenticado');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        // Asegurar que los campos estén limpios
        deliveredBy: formData.deliveredBy.trim(),
        courierCompany: formData.courierCompany.trim(),
        department: formData.department.trim(),
        receivedBy: formData.receivedBy.trim(),
        description: formData.description.trim(),
        comments: formData.comments.trim()
      };

      console.log('Enviando datos al servidor:', payload);
      console.log('URL de la API:', buildApiUrl('/api/access-logs'));

      const response = await fetch(buildApiUrl('/api/access-logs'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      const data = await response.json();
      console.log('Datos de respuesta:', data);

      if (response.ok) {
        Alert.alert(
          'Éxito', 
          'Registro de acceso guardado exitosamente',
          [
            {
              text: 'OK',
              onPress: () => {
                // Limpiar formulario
                setFormData({
                  deliveredBy: '',
                  courierCompany: '',
                  department: '',
                  receivedBy: '',
                  description: '',
                  status: 'entregado',
                  comments: ''
                });
                console.log('Formulario limpiado');
              }
            }
          ]
        );
      } else {
        console.error('Error del servidor:', data);
        Alert.alert('Error', data.message || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar formulario
  const handleClear = () => {
    Alert.alert(
      'Limpiar formulario',
      '¿Estás seguro de que quieres limpiar todos los campos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            setFormData({
              deliveredBy: '',
              courierCompany: '',
              department: '',
              receivedBy: '',
              description: '',
              status: 'entregado',
              comments: ''
            });
            console.log('Formulario limpiado manualmente');
          }
        }
      ]
    );
  };

  // Botón de debug (solo en desarrollo)
  const handleDebug = () => {
    debugFormData();
    Alert.alert('Debug', 'Revisa la consola para ver el estado del formulario');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nueva entrada de paquetería</Text>
      
      {/* Información de fecha y hora */}
      <View style={styles.dateInfo}>
        <Text style={styles.dateLabel}>Fecha y hora:</Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </Text>
      </View>

      <View style={styles.card}>
        {/* Entregador */}
        <Text style={styles.label}>¿Quién entrega? *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de quien entrega"
          placeholderTextColor="#aaa"
          value={formData.deliveredBy}
          onChangeText={(text) => handleInputChange('deliveredBy', text)}
          autoCapitalize="words"
        />

        {/* Empresa de paquetería */}
        <Text style={styles.label}>Paquetería *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. DHL, FedEx, Estafeta"
          placeholderTextColor="#aaa"
          value={formData.courierCompany}
          onChangeText={(text) => handleInputChange('courierCompany', text)}
          autoCapitalize="words"
        />

        {/* Departamento */}
        <Text style={styles.label}>Departamento *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 201, 3B, Apto 5"
          placeholderTextColor="#aaa"
          value={formData.department}
          onChangeText={(text) => handleInputChange('department', text)}
          autoCapitalize="characters"
        />

        {/* Receptor */}
        <Text style={styles.label}>¿Quién recibe? *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de quien recibe"
          placeholderTextColor="#aaa"
          value={formData.receivedBy}
          onChangeText={(text) => handleInputChange('receivedBy', text)}
          autoCapitalize="words"
        />

        {/* Descripción */}
        <Text style={styles.label}>Descripción del paquete</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Contenido del paquete (opcional)"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
          autoCapitalize="sentences"
        />

        {/* Estado */}
        <Text style={styles.label}>Estado *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status}
            style={styles.picker}
            onValueChange={(itemValue) => handleInputChange('status', itemValue)}
          >
            <Picker.Item label="Entregado" value="entregado" />
            <Picker.Item label="Pendiente" value="pendiente" />
            <Picker.Item label="Rechazado" value="rechazado" />
          </Picker>
        </View>

        {/* Comentarios */}
        <Text style={styles.label}>Comentarios adicionales</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Comentarios adicionales (opcional)"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={3}
          value={formData.comments}
          onChangeText={(text) => handleInputChange('comments', text)}
          autoCapitalize="sentences"
        />

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.clearButton]} 
            onPress={handleClear}
            disabled={loading}
          >
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Botón de debug (solo en desarrollo) */}
        <TouchableOpacity 
          style={[styles.button, styles.debugButton]} 
          onPress={handleDebug}
        >
          <Text style={styles.debugButtonText}>Debug (Ver consola)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingBottom: 100
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  dateInfo: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 5,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
  },
  buttonText: {
    color: Colors.textOnPrimary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  clearButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },
  debugButton: {
    backgroundColor: Colors.secondary,
    marginTop: 15,
  },
  debugButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
