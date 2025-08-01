import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../themes/colors';

export default function BitacoraMenuScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona el tipo de bitácora</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BitacoraGeneral')}
      >
        <Icon name="notebook" size={40} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Bitácora General</Text>
          <Text style={styles.cardSubtitle}>Registra eventos generales del edificio.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BitacoraAccesos')}
      >
        <Icon name="door" size={40} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Bitácora de Accesos</Text>
          <Text style={styles.cardSubtitle}>Controla entradas y salidas de visitantes.</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    marginLeft: 15,
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
}); 