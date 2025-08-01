import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../../themes/colors';

export default function BitacoraMenuScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Selecciona el tipo de bitácora</Text>

      {/* Bitácora General */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Personal')}
      >
        <Icon name="notebook" size={40} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Bitácora General</Text>
          <Text style={styles.cardSubtitle}>Registra eventos generales del edificio.</Text>
        </View>
      </TouchableOpacity>

      {/* Bitácora de Accesos - Formulario */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Accesos')}
      >
        <Icon name="door" size={40} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Nuevo Registro de Acceso</Text>
          <Text style={styles.cardSubtitle}>Registra nueva entrada de paquetería o visitantes.</Text>
        </View>
      </TouchableOpacity>

      {/* Bitácora de Accesos - Lista */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AccesosList')}
      >
        <Icon name="format-list-bulleted" size={40} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Ver Registros de Accesos</Text>
          <Text style={styles.cardSubtitle}>Consulta y gestiona todos los registros de accesos.</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    shadowRadius: 5,
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
