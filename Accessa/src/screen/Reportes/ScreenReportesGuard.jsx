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

export default function ScreenReportesGuard({ navigation }) {
  const { user } = useContext(UserContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      console.log('🔍 Intentando obtener reportes desde:', buildApiUrl('/api/reports'));
      
      const response = await fetch(buildApiUrl('/api/reports'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Reportes obtenidos:', data.length, 'reportes');
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
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando reportes...</Text>
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
        <Text style={styles.title}>Reportes de Residentes</Text>
        <Text style={styles.subtitle}>
          {reports.length} reporte{reports.length !== 1 ? 's' : ''} encontrado{reports.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {!reports || reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay reportes registrados</Text>
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
            
            <Text style={styles.reportDescription} numberOfLines={2}>
              {report.description}
            </Text>
            
            <View style={styles.reportFooter}>
              <Text style={styles.reportAuthor}>
                Por: {report.userId?.fullName || 'Usuario'}
              </Text>
              <Text style={styles.reportDate}>
                {formatDate(report.createdAt)}
              </Text>
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
    fontSize: 16,
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
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportAuthor: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  reportDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
}); 