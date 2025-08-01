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

export default function ScreenCodigoQRGuard({ navigation }) {
  const { user } = useContext(UserContext);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllQRCodes = async () => {
    try {
      console.log('🔍 Obteniendo todos los códigos QR');
      console.log('🔗 URL:', buildApiUrl('/api/qr-codes'));
      
      const response = await fetch(buildApiUrl('/api/qr-codes'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Códigos QR cargados:', data.length, 'códigos');
        console.log('📋 Primer código QR:', data[0]);
        setQrCodes(data);
      } else {
        console.error('❌ Error en respuesta:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('📄 Contenido del error:', errorText);
        Alert.alert('Error', 'No se pudieron cargar los códigos QR');
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
    fetchAllQRCodes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllQRCodes();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha no disponible';
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  const getStatusColor = (expirationDate) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    
    if (now > expiration) {
      return '#FF6B6B'; // Rojo - Expirado
    } else if (expiration - now < 24 * 60 * 60 * 1000) {
      return '#FFA500'; // Naranja - Expira pronto (menos de 24h)
    } else {
      return '#4CAF50'; // Verde - Válido
    }
  };

  const getStatusText = (expirationDate) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    
    if (now > expiration) {
      return 'Expirado';
    } else if (expiration - now < 24 * 60 * 60 * 1000) {
      return 'Expira pronto';
    } else {
      return 'Válido';
    }
  };

  const parseGuestInformation = (information) => {
    if (!information) {
      console.log('❌ No hay información del invitado');
      return {};
    }
    
    try {
      const parsed = JSON.parse(information);
      console.log('✅ Información parseada exitosamente:', parsed);
      return parsed;
    } catch (error) {
      console.error('❌ Error parsing guest information:', error);
      console.error('📄 Contenido que causó error:', information);
      return {};
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando códigos QR...</Text>
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
        <Text style={styles.title}>Historial de Códigos QR</Text>
        <Text style={styles.subtitle}>
          Todos los códigos QR generados por los residentes
        </Text>
        <Text style={styles.count}>
          {qrCodes.length} código{qrCodes.length !== 1 ? 's' : ''} encontrado{qrCodes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {!qrCodes || qrCodes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay códigos QR registrados</Text>
          <Text style={styles.emptySubtext}>Los códigos QR generados por los residentes aparecerán aquí</Text>
        </View>
      ) : (
                 qrCodes.map((qrCode) => {
           console.log('📋 Código QR completo:', qrCode);
           console.log('📄 Campo information:', qrCode.information);
           const guestInfo = parseGuestInformation(qrCode.information);
           console.log('👤 Información parseada:', guestInfo);
          
          return (
            <View key={qrCode._id} style={styles.qrCard}>
              <View style={styles.qrHeader}>
                <Text style={styles.qrTitle}>
                  Código QR - {guestInfo.guestName || 'Visitante'}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(qrCode.expirationDate) }]}>
                  <Text style={styles.statusText}>{getStatusText(qrCode.expirationDate)}</Text>
                </View>
              </View>
              
              <View style={styles.qrInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Residente:</Text>
                  <Text style={styles.infoValue}>{qrCode.userId?.fullName || 'Desconocido'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Visitante:</Text>
                  <Text style={styles.infoValue}>{guestInfo.guestName || 'No especificado'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Motivo:</Text>
                  <Text style={styles.infoValue}>{guestInfo.reason || 'No especificado'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fecha de visita:</Text>
                  <Text style={styles.infoValue}>{guestInfo.visitDate || 'No especificada'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Hora de entrada:</Text>
                  <Text style={styles.infoValue}>{guestInfo.entryTime || 'No especificada'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Hora de salida:</Text>
                  <Text style={styles.infoValue}>{guestInfo.exitTime || 'No especificada'}</Text>
                </View>
              </View>
              
              <View style={styles.qrFooter}>
                <Text style={styles.qrDate}>
                  Generado: {formatDate(qrCode.createdAt)}
                </Text>
                <Text style={styles.qrExpiration}>
                  Expira: {formatDate(qrCode.expirationDate)}
                </Text>
              </View>
            </View>
          );
        })
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
    marginBottom: 5,
  },
  count: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
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
  qrCard: {
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
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qrTitle: {
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
  qrInfo: {
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
    width: 100,
  },
  infoValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
  qrFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  qrDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  qrExpiration: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
}); 