import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ScreenCodigoQRSecurity({ navigation }) {
  return (
    <View style={styles.contenedor}>
      <MaterialIcons name="qr-code" size={80} color="#007aff" />
      <Text style={styles.titulo}>Escanea tu código de visita</Text>
      <Text style={styles.descripcion}>
        Usa la cámara para escanear el código QR que te fue proporcionado para acceder al condominio de forma segura.
      </Text>
      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Text style={styles.textoBoton}>Escanear código</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  boton: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
