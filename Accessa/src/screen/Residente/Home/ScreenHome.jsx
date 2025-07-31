import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Card, Title, Avatar } from 'react-native-paper';
import { Colors } from '../../../themes/colors.js';
import { ActionCard } from '../../../components/ActionCard.js';
import { InfoCard } from '../../../components/InfoCard.js';
import { UserContext } from '../../../context/UserContext.js';
import { buildApiUrl } from '../../../config/api.js';


export default function ScreenHome({ navigation }) {
  const { user } = useContext(UserContext);
  const usuario = user ? user.name : 'Usuario';
  const [reportStats, setReportStats] = useState({
    total: 0,
    thisMonth: 0,
    loading: true
  });

  // Función para obtener estadísticas de reportes del usuario
  const fetchReportStats = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch(buildApiUrl(`/api/reports/user/${user._id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

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
      console.error('Error fetching report stats:', error);
      setReportStats({ total: 0, thisMonth: 0, loading: false });
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    fetchReportStats();
  }, [user]);

  const goToPanico = () => navigation.navigate('Panico');
  const goToReportes = () => navigation.navigate('Reportes');
  const goToQR = () => navigation.navigate('QR');
  const goToReportDetails = () => navigation.navigate('ReportDetails');
  const goToQRdetails = () => navigation.navigate('QRList')

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header de bienvenida */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>¡Bienvenido, {usuario}!</Text>
          <Text style={styles.subtitle}>Opciones disponibles</Text>
        </View>

        {/* Botón de emergencia */}
        <TouchableOpacity style={styles.emergencyCard} onPress={goToPanico}>
          <Card.Content style={styles.emergencyCardContent}>
            <Avatar.Icon icon="alert" size={48} style={styles.emergencyIcon} />
            <View style={styles.emergencyTextContainer}>
              <Text style={styles.emergencyTitle}>Botón de Emergencia</Text>
              <Text style={styles.emergencysub}>Solo en caso de emergencias</Text>
            </View>
          </Card.Content>
        </TouchableOpacity>

        {/* Acciones principales */}
        <View style={styles.actionsGrid}>
          <ActionCard
            icon="file-document"
            title="Reportes"
            subtitle="Ver y crear reportes"
            onPress={goToReportes}
          />
          <ActionCard
            icon="qrcode"
            title="Código QR"
            subtitle="Generar invitaciones"
            onPress={goToQR}
            style={{ color: Colors.textPrimary }}
          />
        </View>

        {/* Estadísticas */}
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <Text style={styles.sectionSub}>Estadisticas mensuales</Text>
        <View style={styles.cardContainer}>
          <InfoCard
            icon="file-document"
            title="Reportes"
            metric={reportStats.loading ? 'Cargando...' : `${reportStats.thisMonth}`}
            subtitle="Este mes"
            buttonLabel="Ver detalles"
            onPress={goToReportDetails}
          />
          <InfoCard
            icon="qrcode"
            title="CodigosQR"
            metric={reportStats.loading ? 'Cargando...' : `${reportStats.thisMonth}`}
            subtitle="Este mes"
            buttonLabel="Ver detalles"
            onPress={goToQRdetails}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.title,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.title,
    textAlign: 'center',
  },
  emergencyCard: {
    borderRadius: 15,
    backgroundColor: Colors.danger,
    marginBottom: 28,
    elevation: 4,
  },
  emergencyCardContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emergencyIcon: {
    backgroundColor: Colors.danger,
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    textAlign: 'center'
  },
  emergencysub: { color: 'white', fontSize: 13, textAlign: 'center', marginTop: 5 },
  actionsGrid: {
    gap: 20,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.title,
    marginBottom: 10,
    textAlign: 'center'
  },
  sectionSub: {
    fontSize: 15,
    color: Colors.title,
    marginBottom: 25,
    textAlign: 'center'
  },
  cardContainer: {
    gap: 20,
    marginLeft: 15,
    marginRight: 15
  },
});
