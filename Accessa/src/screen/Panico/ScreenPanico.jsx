import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../themes/colors';

export default function ScreenPanico({ navigation }) {
  const handlePanicPress = () => {
    // Aquí se puede agregar lógica de emergencia real
    console.log('Botón de emergencia presionado');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Botón de Emergencia</Text>
      <Text style={styles.subtitle}>Presiona solo en situaciones reales</Text>

      <TouchableOpacity onPress={handlePanicPress} style={styles.panicButton}>
        <Text style={styles.panicText}>SOS</Text>
        <Text style={styles.panicSubText}>Emergencia</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Al presionar este botón:</Text>
        <Text style={styles.infoItem}>• Se enviará tu ubicación</Text>
        <Text style={styles.infoItem}>• Se alertará a tus contactos</Text>
        <Text style={styles.infoItem}>• Se puede activar una alarma</Text>
        <Text style={styles.infoNote}>⚠️ Úsalo solo en emergencias reales.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  panicButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  panicText: {
    fontSize: 46,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    letterSpacing: 3,
  },
  panicSubText: {
    fontSize: 14,
    color: Colors.textOnPrimary,
    marginTop: 4,
  },
  infoBox: {
    marginTop: 40,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    elevation: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 12,
  },
});
