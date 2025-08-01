import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Card, Title, Avatar } from 'react-native-paper';
import { Colors } from '../../themes/colors.js';
import { ActionCard } from '../../components/ActionCard.js';
import { InfoCard } from '../../components/InfoCard.js';
import { UserContext } from '../../context/UserContext';
import { buildApiUrl } from '../../config/api';

export default function ScreenHomeGuard({ navigation }) {
  const { user } = useContext(UserContext);
  const usuario = user ? user.name : 'Guardia';
  const [reportStats, setReportStats] = useState({
    total: 0,
    thisMonth: 0,
    loading: true
  });
  
  const [qrStats, setQrStats] = useState({
    total: 0,
    thisMonth: 0,
    loading: true
  });

  // Función para obtener estadísticas de reportes
  const fetchReportStats = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
      
      const response = await fetch(buildApiUrl('/api/reports'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const reports = await response.json();
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const thisMonthReports = reports.filter(report => 
          new Date(report.createdAt) >= thisMonth
        );
        
        setReportStats({
          total: reports.length,
          thisMonth: thisMonthReports.length,
          loading: false
        });
      } else {
        setReportStats({ total: 0, thisMonth: 0, loading: false });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // Timeout - no mostrar error
        setReportStats({ total: 0, thisMonth: 0, loading: false });
      } else {
        // Otro tipo de error - mostrar solo una vez
        console.error('Error de conectividad:', error.message);
        setReportStats({ total: 0, thisMonth: 0, loading: false });
      }
    }
  };

  // Función para obtener estadísticas de códigos QR
  const fetchQRStats = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(buildApiUrl('/api/qr-codes'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const qrCodes = await response.json();
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const thisMonthQRCodes = qrCodes.filter(qr => 
          new Date(qr.createdAt) >= thisMonth
        );
        
        setQrStats({
          total: qrCodes.length,
          thisMonth: thisMonthQRCodes.length,
          loading: false
        });
      } else {
        setQrStats({ total: 0, thisMonth: 0, loading: false });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setQrStats({ total: 0, thisMonth: 0, loading: false });
      } else {
        console.error('Error de conectividad QR:', error.message);
        setQrStats({ total: 0, thisMonth: 0, loading: false });
      }
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    fetchReportStats();
    fetchQRStats();
  }, [user]);

  const goToPanico = () => navigation.navigate('Panico');
  const goToReportes = () => navigation.navigate('Reportes');
  const goToQR = () => navigation.navigate('QR');
  const goToBitacora = () => navigation.navigate('Bitácora');
  const goToReportHistory = () => navigation.navigate('Reportes');
  const goToQRHistory = () => navigation.navigate('QR');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header de bienvenida */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>¡Bienvenido, seguridad!</Text>
          <Text style={styles.userName}>{usuario}</Text>
          <Text style={styles.subtitle}>Opciones disponibles</Text>
        </View>

        {/* Botón de Emergencia */}
        <TouchableOpacity style={styles.emergencyCard} onPress={goToPanico}>
          <Card.Content style={styles.emergencyCardContent}>
            <Avatar.Icon icon="alert" size={48} style={styles.emergencyIcon} />
            <View style={styles.emergencyTextContainer}>
              <Text style={styles.emergencyTitle}>Botón de Emergencia</Text>
              <Text style={styles.emergencySubtitle}>Solo en caso de emergencias</Text>
            </View>
          </Card.Content>
        </TouchableOpacity>

        {/* Acciones principales para guardias */}
        <View style={styles.actionsGrid}>
          <ActionCard
            icon="notebook"
            title="Bitácora"
            subtitle="Crear registros de actividades"
            onPress={goToBitacora}
          />
          <ActionCard
            icon="file-document"
            title="Reportes"
            subtitle="Ver reportes de residentes"
            onPress={goToReportes}
          />
          <ActionCard
            icon="qrcode-scan"
            title="Escaner QR"
            subtitle="Leer solicitudes recibidas"
            onPress={goToQR}
          />
        </View>

        {/* Sección de Estadísticas */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Estadísticas</Text>
          
          <View style={styles.statsGrid}>
            {/* Estadísticas de Reportes */}
            <TouchableOpacity style={styles.statsCard} onPress={goToReportHistory}>
              <Card.Content style={styles.statsCardContent}>
                <Avatar.Icon icon="file-document" size={40} style={styles.statsIcon} />
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsCardTitle}>Reportes</Text>
                  <Text style={styles.statsCardValue}>
                    {reportStats.loading ? '...' : reportStats.total}
                  </Text>
                  <Text style={styles.statsCardSubtitle}>
                    Este mes: {reportStats.loading ? '...' : reportStats.thisMonth}
                  </Text>
                </View>
              </Card.Content>
            </TouchableOpacity>

            {/* Estadísticas de Códigos QR */}
            <TouchableOpacity style={styles.statsCard} onPress={goToQRHistory}>
              <Card.Content style={styles.statsCardContent}>
                <Avatar.Icon icon="qrcode" size={40} style={styles.statsIcon} />
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsCardTitle}>Códigos QR</Text>
                  <Text style={styles.statsCardValue}>
                    {qrStats.loading ? '...' : qrStats.total}
                  </Text>
                  <Text style={styles.statsCardSubtitle}>
                    Este mes: {qrStats.loading ? '...' : qrStats.thisMonth}
                  </Text>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emergencyCard: {
    backgroundColor: Colors.danger,
    borderRadius: 16,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emergencyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  emergencyIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  emergencyTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  emergencySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  statsSection: {
    marginTop: 20,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsCardContent: {
    padding: 16,
  },
  statsIcon: {
    backgroundColor: Colors.primaryLight,
    marginBottom: 8,
  },
  statsTextContainer: {
    alignItems: 'center',
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statsCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statsCardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
}); 