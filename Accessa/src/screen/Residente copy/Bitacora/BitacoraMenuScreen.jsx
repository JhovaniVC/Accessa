import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BitacoraMenuScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona el tipo de bitácora</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Personal')}
      >
        <Icon name="notebook" size={40} color="#1e88e5" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Bitácora General</Text>
          <Text style={styles.cardSubtitle}>Registra eventos generales del edificio.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Accesos')}
      >
        <Icon name="door" size={40} color="#43a047" />
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
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
  },
  cardContent: {
    marginLeft: 15,
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
