import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../../themes/colors';

export default function ScreenPanicoSecurity({ navigation }) {
  const handlePanicPress = () => {
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
        <Text style={styles.infoTitle}>¿Qué ocurre al presionar el botón?</Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Se enviará tu ubicación en tiempo real.</Text>
        </View>
        <View style={styles.bulletContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Se alertará a tus contactos de confianza.</Text>
        </View>
        <View style={styles.bulletContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Podría activarse una alarma audible.</Text>
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  panicButton: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    marginBottom: 40,
  },
  panicText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    letterSpacing: 4,
  },
  panicSubText: {
    fontSize: 16,
    color: Colors.textOnPrimary,
    marginTop: 6,
  },
  infoBox: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 20,
    width: '100%',
    elevation: 5,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  infoNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 14,
  },
});
