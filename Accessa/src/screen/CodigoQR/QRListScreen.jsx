import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { Colors } from '../../themes/colors';
import { UserContext } from '../../context/UserContext';
import { buildApiUrl } from '../../config/api';

export default function QRListScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const qrRef = useRef();

  // Función para obtener todos los códigos QR del usuario
  const fetchUserQRCodes = async () => {
    if (!user?._id) {
      console.log('❌ No hay usuario logueado');
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Obteniendo códigos QR para usuario:', user._id);
      console.log('🔗 URL:', buildApiUrl(`/api/qr-codes/user/${user._id}`));
      
      const response = await fetch(buildApiUrl(`/api/qr-codes/user/${user._id}`), {
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
    }
  };

  useEffect(() => {
    fetchUserQRCodes();
  }, [user]);

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
    try {
      return JSON.parse(information);
    } catch (error) {
      return { guestName: 'Información no disponible' };
    }
  };

  const showQRCode = (qrCode) => {
    // Verificar que el código no haya expirado
    if (new Date(qrCode.expirationDate) <= new Date()) {
      Alert.alert('Código Expirado', 'Este código QR ya ha expirado y no puede ser utilizado.');
      return;
    }
    
    setSelectedQR(qrCode);
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedQR(null);
  };

  const getQRValue = (qrCode) => {
    const guestInfo = parseGuestInformation(qrCode.information);
    return `Código QR de Acceso\n\nInvitado: ${guestInfo.guestName}\nTeléfono: ${guestInfo.phoneNumber || 'No especificado'}\nMotivo: ${guestInfo.reason || 'No especificado'}\nExpira: ${formatDate(qrCode.expirationDate)}\n\nToken: ${qrCode.token}`;
  };

  const shareQRCode = async () => {
    if (!selectedQR || !qrRef.current) return;
    
    try {
      // Capturar la imagen del QR
      const uri = await qrRef.current.capture();
      
      const guestInfo = parseGuestInformation(selectedQR.information);
      const shareMessage = `Código QR de Acceso\n\nInvitado: ${guestInfo.guestName}\nTeléfono: ${guestInfo.phoneNumber || 'No especificado'}\nMotivo: ${guestInfo.reason || 'No especificado'}\nExpira: ${formatDate(selectedQR.expirationDate)}\n\nToken: ${selectedQR.token}`;
      
      await Share.share({
        message: shareMessage,
        url: uri, // Incluir la imagen del QR
        title: 'Código QR de Acceso - Accessa'
      });
    } catch (error) {
      console.error('Error sharing QR:', error);
      Alert.alert('Error', 'No se pudo compartir el código QR');
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Códigos QR</Text>
        <Text style={styles.subtitle}>
          {qrCodes.length} código{qrCodes.length !== 1 ? 's' : ''} en total
        </Text>
      </View>

      {qrCodes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes códigos QR creados aún</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('QRCreator')}
          >
            <Text style={styles.createButtonText}>Crear mi primer código QR</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.qrCodesContainer}>
          {qrCodes && qrCodes.map((qrCode, index) => {
            const guestInfo = parseGuestInformation(qrCode.information);
            return (
              <View key={qrCode._id || index} style={styles.qrCodeCard}>
                <View style={styles.qrCodeHeader}>
                  <View style={styles.qrCodeInfo}>
                    <Text style={styles.guestName}>{guestInfo.guestName}</Text>
                    <Text style={styles.createdDate}>Creado: {formatDate(qrCode.createdAt)}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(qrCode.expirationDate) }
                  ]}>
                    <Text style={styles.statusText}>
                      {getStatusText(qrCode.expirationDate)}
                    </Text>
                  </View>
                </View>

                <View style={styles.qrCodeDetails}>
                  <Text style={styles.detailLabel}>Teléfono:</Text>
                  <Text style={styles.detailText}>{guestInfo.phoneNumber || 'No especificado'}</Text>
                  
                  <Text style={styles.detailLabel}>Motivo:</Text>
                  <Text style={styles.detailText}>{guestInfo.reason || 'No especificado'}</Text>
                  
                  <Text style={styles.detailLabel}>Expira:</Text>
                  <Text style={styles.detailText}>{formatDate(qrCode.expirationDate)}</Text>
                  
                  <Text style={styles.detailLabel}>Token:</Text>
                  <Text style={styles.tokenText}>{qrCode.token}</Text>
                  
                                     {new Date(qrCode.expirationDate) > new Date() && (
                     <TouchableOpacity 
                       style={styles.viewQRButton}
                       onPress={() => showQRCode(qrCode)}
                     >
                       <Text style={styles.viewQRButtonText}>Ver Código QR</Text>
                     </TouchableOpacity>
                   )}
                   
                   {new Date(qrCode.expirationDate) <= new Date() && (
                     <View style={styles.expiredMessage}>
                       <Text style={styles.expiredMessageText}>Código expirado</Text>
                     </View>
                   )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Modal para mostrar el QR */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeQRModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Código QR</Text>
              <TouchableOpacity onPress={closeQRModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
                                      {selectedQR && (
               <View style={styles.qrModalContent}>
                 <Text style={styles.qrModalTitle}>✅ Código QR de Acceso</Text>
                 <Text style={styles.qrModalSubtitle}>
                   Para: {parseGuestInformation(selectedQR.information).guestName}
                 </Text>
                 
                 <ViewShot ref={qrRef} style={styles.qrCodeContainer}>
                   <QRCode
                     value={getQRValue(selectedQR)}
                     size={180}
                     color="black"
                     backgroundColor="white"
                     logoSize={30}
                     logoMargin={2}
                     logoBorderRadius={15}
                     logoBackgroundColor="white"
                   />
                 </ViewShot>
                 
                 <View style={styles.qrInfoContainer}>
                   <Text style={styles.tokenLabel}>Token de acceso:</Text>
                   <Text style={styles.tokenDisplay}>{selectedQR.token}</Text>
                   <Text style={styles.scanText}>
                     Escanea este código QR con cualquier app de QR para acceder
                   </Text>
                   <Text style={styles.scanText}>
                     El QR contiene toda la información del invitado
                   </Text>
                 </View>
                 
                 <View style={styles.infoRow}>
                   <Text style={styles.infoLabel}>Invitado:</Text>
                   <Text style={styles.infoValue}>{parseGuestInformation(selectedQR.information).guestName}</Text>
                 </View>
                 
                 <View style={styles.infoRow}>
                   <Text style={styles.infoLabel}>Teléfono:</Text>
                   <Text style={styles.infoValue}>{parseGuestInformation(selectedQR.information).phoneNumber || 'No especificado'}</Text>
                 </View>
                 
                 <View style={styles.infoRow}>
                   <Text style={styles.infoLabel}>Motivo:</Text>
                   <Text style={styles.infoValue}>{parseGuestInformation(selectedQR.information).reason || 'No especificado'}</Text>
                 </View>
                 
                 <View style={styles.infoRow}>
                   <Text style={styles.infoLabel}>Expira:</Text>
                   <Text style={styles.infoValue}>{formatDate(selectedQR.expirationDate)}</Text>
                 </View>
                 
                 <View style={styles.modalButtonsContainer}>
                   <TouchableOpacity 
                     style={[styles.modalButton, styles.shareButton]}
                     onPress={shareQRCode}
                   >
                     <Text style={styles.shareButtonText}>Compartir</Text>
                   </TouchableOpacity>
                   
                   <TouchableOpacity 
                     style={[styles.modalButton, styles.closeModalButton]}
                     onPress={closeQRModal}
                   >
                     <Text style={styles.closeModalButtonText}>Cerrar</Text>
                   </TouchableOpacity>
                 </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  qrCodesContainer: {
    padding: 20,
  },
  qrCodeCard: {
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
  qrCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  qrCodeInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  createdDate: {
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
  qrCodeDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  tokenText: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: 'monospace',
    backgroundColor: Colors.highlight,
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  viewQRButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  viewQRButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  expiredMessage: {
    backgroundColor: Colors.grayLight,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  expiredMessageText: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  qrModalContent: {
    alignItems: 'center',
    width: '100%',
  },
  qrModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  qrCodeContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  qrModalSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 15,
    textAlign: 'center',
  },
  qrInfoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  tokenDisplay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
    backgroundColor: Colors.highlight,
    padding: 8,
    borderRadius: 6,
  },
  scanText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  shareButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  closeModalButton: {
    backgroundColor: Colors.primary,
  },
  closeModalButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
}); 