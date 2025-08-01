import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { Colors } from '../themes/colors';

export const InfoCard = ({ icon, title, metric, subtitle, buttonLabel, onPress }) => (
  <Card style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.title}>{title}</Text>
    </View>

    <Card.Content>
      <View style={styles.row}>
        <Avatar.Icon
          icon={icon}
          size={60}
          color={Colors.primaryDark}
          style={[styles.icon, { backgroundColor: '#fff' }]}
        />

        <View style={styles.texts}>
          <Text style={styles.metric}>{metric}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: Colors.card,
    marginVertical: 0,
    elevation: 3, // sombra para Android
    shadowColor: '#000', // sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    backgroundColor: Colors.title,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.card,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
  },
  icon: {
    borderRadius: 20,
  },
  texts: {
    flex: 1,
    paddingLeft: 10,
  },
  metric: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
