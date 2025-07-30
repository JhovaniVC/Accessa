import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Title, Avatar } from 'react-native-paper';
import { Colors } from '../themes/colors';


export const InfoCard = ({ icon, title, metric, subtitle, buttonLabel, onPress }) => (
  <Card style={styles.infoCard}>
    <Card.Content style={styles.infoCardContent}>
      <View style={styles.infoHeader}>
        <Avatar.Icon icon={icon} size={40} style={styles.infoIcon} />
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Title style={styles.infoMetric}>{metric}</Title>
      <Text style={styles.infoSubtitle}>{subtitle}</Text>
      <Button
        mode="outlined"
        style={styles.infoButton}
        labelStyle={styles.infoButtonLabel}
        onPress={onPress}
      >
        {buttonLabel}
      </Button>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 40,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.title,
    alignSelf: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title,
    marginTop:30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title,
    marginVertical: 16,
  },
  // Emergencia
  emergencyCard: {
    borderRadius: 15,
    backgroundColor: Colors.danger,
    marginBottom: 24,
    alignItems: 'center',
  },
  emergencyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  emergencyIcon: {
    backgroundColor: Colors.danger,
    marginRight: 16,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emergencyButton: {
    backgroundColor: Colors.danger,
    borderRadius: 8,
    marginLeft: 16,
    width: 100,
  },
  emergencyButtonLabel: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Acciones
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    
  },
  actionCard: {
    width: '48%',
    borderRadius: 12,
    backgroundColor: Colors.primary,
    color: Colors.textOnPrimary, 
    elevation: 2,
  },
  actionCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    backgroundColor: Colors.primary,
    color: Colors.textPrimary,
    marginBottom: 12,
    borderRadius:50
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 1,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  
  // Info
  cardContainer: {
    marginBottom: 20,
  },
  infoCard: {
    borderRadius: 12,
    backgroundColor: Colors.card,
    elevation: 2,
  },
  infoCardContent: {
    padding: 16,
  },
  infoHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    backgroundColor: Colors.primaryLight,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  infoMetric: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  infoButton: {
    borderColor: Colors.primary,
    borderRadius: 8,
  },
  infoButtonLabel: {
    color: Colors.primary,
    fontSize: 14,
  },
});
