import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Colors } from '../../themes/colors';
import { buildApiUrl, buildImageUrl } from '../../config/api';

export default function ReportDetailScreen({ navigation, route }) {
  const reportId = route?.params?.reportId;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReportDetails = async () => {
    try {
      const response = await fetch(buildApiUrl(`/api/reports/${reportId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Detalles del reporte cargados:', data);
        setReport(data);
      } else {
        Alert.alert('Error', 'No se pudo cargar el reporte');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReportDetails();
    } else {
      setLoading(false);
      Alert.alert('Error', 'No se proporcionó un ID de reporte válido');
      navigation.goBack();
    }
  }, [reportId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'in_progress':
        return Colors.primary;
      case 'completed':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Proceso';
      case 'completed':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  const getTypeText = (type) => {
    console.log('Tipo recibido en detalles:', type);
    if (!type) return 'No especificado';
    
    // Los valores que vienen de la API son strings directos
    switch (type) {
      case 'Mantenimiento':
        return 'Mantenimiento';
      case 'Seguridad':
        return 'Seguridad';
      case 'Limpieza':
        return 'Limpieza';
      case 'Ruido':
        return 'Ruido';
      case 'Otro':
        return 'Otro';
      case 'Vandalismo':
        return 'Vandalismo';
      case 'Robo':
        return 'Robo';
      case 'Accidente':
        return 'Accidente';
      default:
        return type; // Retornar el valor original si no coincide
    }
  };

  const getLocationText = (location) => {
    console.log('Ubicación recibida en detalles:', location);
    if (!location) return 'No especificada';
    
    // Los valores que vienen de la API son strings directos
    switch (location) {
      case 'Área común':
        return 'Área común';
      case 'Estacionamiento':
        return 'Estacionamiento';
      case 'Jardín':
        return 'Jardín';
      case 'Pasillo':
        return 'Pasillo';
      case 'Elevador':
        return 'Elevador';
      case 'Otro':
        return 'Otro';
      case 'Edificio A':
        return 'Edificio A';
      case 'Calle 2':
        return 'Calle 2';
      default:
        return location; // Retornar el valor original si no coincide
    }
  };

  if (!reportId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se proporcionó un ID de reporte válido</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el reporte</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
             <View style={styles.header}>
         <Text style={styles.title}>{report.problemType || 'Reporte sin título'}</Text>
         <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status || 'pending') }]}>
           <Text style={styles.statusText}>{getStatusText(report.status || 'pending')}</Text>
         </View>
       </View>

       <View style={styles.card}>
         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Descripción</Text>
           <Text style={styles.description}>{report.description}</Text>
         </View>

         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Información del Reporte</Text>
           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Tipo:</Text>
             <Text style={styles.infoValue}>{getTypeText(report.problemType)}</Text>
           </View>
           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Ubicación:</Text>
             <Text style={styles.infoValue}>{getLocationText(report.problemLocation)}</Text>
           </View>
           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Fecha:</Text>
             <Text style={styles.infoValue}>{formatDate(report.createdAt)}</Text>
           </View>
           {report.updatedAt && report.updatedAt !== report.createdAt && (
             <View style={styles.infoRow}>
               <Text style={styles.infoLabel}>Actualizado:</Text>
               <Text style={styles.infoValue}>{formatDate(report.updatedAt)}</Text>
             </View>
           )}
         </View>

         {report.evidence && (
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Evidencia</Text>
             <Image
               source={{ uri: buildImageUrl(report.evidence) }}
               style={styles.evidenceImage}
               resizeMode="cover"
             />
           </View>
         )}

        {report.adminNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas del Administrador</Text>
            <Text style={styles.adminNotes}>{report.adminNotes}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  card: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  evidenceImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  adminNotes: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
}); 