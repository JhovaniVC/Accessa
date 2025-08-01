import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../themes/colors';
import { UserContext } from '../../context/UserContext';
import { buildApiUrl } from '../../config/api';

export default function ReportHistoryScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserReports = async () => {
    if (!user?._id) {
      console.log('❌ No hay usuario logueado');
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Obteniendo reportes para usuario:', user._id);
      console.log('🔗 URL:', buildApiUrl(`/api/reports/user/${user._id}`));
      
      const response = await fetch(buildApiUrl(`/api/reports/user/${user._id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Reportes cargados:', data.length, 'reportes');
        console.log('📋 Primer reporte:', data[0]);
        setReports(data);
      } else {
        console.error('❌ Error en respuesta:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('📄 Contenido del error:', errorText);
        Alert.alert('Error', 'No se pudieron cargar los reportes');
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserReports();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserReports();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    console.log('Tipo recibido:', type);
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
    console.log('Ubicación recibida:', location);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mi Historial de Reportes</Text>
        <Text style={styles.subtitle}>
          {reports.length} reporte{reports.length !== 1 ? 's' : ''} encontrado{reports.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {!reports || reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes reportes registrados</Text>
          <Text style={styles.emptySubtext}>Los reportes que crees aparecerán aquí</Text>
        </View>
      ) : (
        reports.map((report) => (
          <TouchableOpacity
            key={report._id}
            style={styles.reportCard}
            onPress={() => navigation.navigate('ReportDetails', { reportId: report._id })}
          >
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{report.problemType || 'Reporte sin título'}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status || 'pending') }]}>
                <Text style={styles.statusText}>{getStatusText(report.status || 'pending')}</Text>
              </View>
            </View>
            
            <Text style={styles.reportDescription} numberOfLines={3}>
              {report.description}
            </Text>
            
            <View style={styles.reportInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo:</Text>
                <Text style={styles.infoValue}>{getTypeText(report.problemType)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ubicación:</Text>
                <Text style={styles.infoValue}>{getLocationText(report.problemLocation)}</Text>
              </View>
            </View>
            
            <View style={styles.reportFooter}>
              <Text style={styles.reportDate}>
                {formatDate(report.createdAt)}
              </Text>
              {report.evidence && (
                <View style={styles.imageIndicator}>
                  <Text style={styles.imageText}>📷</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  reportCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  reportDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  reportInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    width: 80,
  },
  infoValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  imageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 14,
  },
}); 