// components/ActionCard.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { Colors } from '../themes/colors';

export const ActionCard = ({ icon, title, subtitle, onPress }) => (
  <Card style={styles.card} onPress={onPress}>
    <Card.Content style={styles.content}>
      <Avatar.Icon icon={icon} size={45} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    width: '90%',
    borderRadius: 15,
    backgroundColor: Colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    textAlign: 'center'
  },
  content: {
    alignItems: 'center',
    alignContent:'center',
  },
  icon: {
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    textAlign: 'center',

  },
  subtitle: {
    fontSize: 12,
    color: Colors.textOnPrimary,
    textAlign: 'center',
    opacity: 0.8,
  },
});