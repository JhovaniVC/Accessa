import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

export default function ScreenScannerQR() {
  const [permiso, solicitarPermiso] = useCameraPermissions();
  const [escaneado, setEscaneado] = useState(false);

  const manejarEscaneoQR = ({ type, data }) => {
    setEscaneado(true);
    Alert.alert(
      `Código ${type} escaneado`,
      `Datos: ${data}`,
      [{ text: 'OK', onPress: () => setEscaneado(false) }],
      { cancelable: false }
    );
  };

  if (!permiso) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.textoPermiso}>Solicitando permiso de la cámara...</Text>
      </View>
    );
  }

  if (!permiso.granted) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.textoPermiso}>Permiso de cámara no concedido.</Text>
        <TouchableOpacity style={styles.botonPermiso} onPress={solicitarPermiso}>
          <Text style={styles.textoBoton}>Solicitar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CameraView
      style={styles.camara}
      onBarcodeScanned={escaneado ? undefined : manejarEscaneoQR}
    >
      <View style={styles.superposicion}>
        <View style={styles.capaCentro}>
          <View style={styles.areaEscaneo}>
            <MaterialIcons name="qr-code-scanner" size={40} color="white" />
            <Text style={styles.tituloEscaneo}>Escanea el código de visita</Text>
            <View style={styles.enfoque} />
          </View>
        </View>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  textoPermiso: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  botonPermiso: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
  },
  camara: {
    flex: 1,
  },
  superposicion: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  capaCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaEscaneo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
    borderRadius: 20,
  },
  tituloEscaneo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  enfoque: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#00ffcc',
    borderRadius: 16,
  },
});
