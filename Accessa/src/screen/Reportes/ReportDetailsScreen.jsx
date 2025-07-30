import React, { useState, useEffect, useContext } from 'react';
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
import { UserContext } from '../../context/UserContext';
import { buildApiUrl, buildImageUrl } from '../../config/api';

export default function ReportDetailsScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener todos los reportes del usuario
  const fetchUserReports = async () => {
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
        const data = await response.json();
        setReports(data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los reportes');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReports();
  }, [user]);

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
      case 'pending': return '#FFA500';
      case 'in_progress': return '#007AFF';
      case 'resolved': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En Proceso';
      case 'resolved': return 'Resuelto';
      default: return 'Sin Estado';
    }
  };

  const getImageUrl = (evidencePath) => {
    return buildImageUrl(evidencePath);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando reportes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Reportes</Text>
        <Text style={styles.subtitle}>
          {reports.length} reporte{reports.length !== 1 ? 's' : ''} en total
        </Text>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes reportes aún</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('Reportes')}
          >
            <Text style={styles.createButtonText}>Crear mi primer reporte</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.reportsContainer}>
          {reports.map((report, index) => (
            <View key={report._id || index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportType}>{report.problemType}</Text>
                  <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusColor(report.status || 'pending') }
                ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(report.status || 'pending')}
                  </Text>
                </View>
              </View>

              <View style={styles.reportDetails}>
                <Text style={styles.locationLabel}>Ubicación:</Text>
                <Text style={styles.locationText}>{report.problemLocation}</Text>
                
                <Text style={styles.descriptionLabel}>Descripción:</Text>
                <Text style={styles.descriptionText}>{report.description}</Text>

                {report.evidence && (
                  <View style={styles.evidenceContainer}>
                    <Text style={styles.evidenceLabel}>Evidencia:</Text>
                    <Text style={styles.debugText}>URL: {getImageUrl(report.evidence)}</Text>
                    <Image 
                      source={{ uri: getImageUrl(report.evidence) }}
                      style={styles.evidenceImage}
                      resizeMode="cover"
                      onLoad={() => console.log('Imagen cargada exitosamente')}
                      onError={(error) => console.log('Error cargando imagen:', error.nativeEvent)}
                    />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
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
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  reportsContainer: {
    padding: 20,
  },
  reportCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  reportDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  evidenceContainer: {
    marginTop: 8,
  },
  evidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  evidenceImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
}); 