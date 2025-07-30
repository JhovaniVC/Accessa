import React, { useState, useContext, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../themes/colors';
import { UserContext } from '../../context/UserContext';
import { buildApiUrl } from '../../config/api';

export default function ScreenCodigoQR({ navigation }) {
  const { user } = useContext(UserContext);
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [qrData, setQrData] = useState(null);
  const qrRef = useRef();

  const formatDate = (date) => {
    if (!date) return 'Selecciona fecha';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Selecciona fecha';
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Selecciona fecha';
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const clearForm = () => {
    setGuestName('');
    setPhoneNumber('');
    setSelectedDate(null);
    setReason('');
    setGeneratedQR(null);
    setQrData(null);
  };

  const shareQRCode = async () => {
    if (!qrData || !qrRef.current) return;
    
    try {
      // Capturar la imagen del QR
      const uri = await qrRef.current.capture();
      
      // Crear mensaje con el formato específico
      const shareMessage = `Código QR de Acceso\n\nInvitado: ${qrData.guestName}\nTeléfono: ${qrData.phoneNumber}\nMotivo: ${qrData.reason}\nExpira: ${formatDate(qrData.expirationDate)}\n\nToken: ${qrData.token}`;
      
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

  const handleSubmit = async () => {
    // Validaciones
    if (!guestName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del invitado');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Por favor ingresa el número de teléfono');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Por favor selecciona una fecha');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Error', 'Por favor ingresa el motivo de la visita');
      return;
    }

    setLoading(true);
    try {
      // Crear objeto con la información del invitado
      const guestInformation = {
        guestName: guestName.trim(),
        phoneNumber: phoneNumber.trim(),
        reason: reason.trim(),
        createdBy: user?.name || 'Usuario'
      };

      const response = await fetch(buildApiUrl('/api/qr-codes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          information: JSON.stringify(guestInformation),
          expirationDate: selectedDate.toISOString(),
          userId: user?._id
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Guardar el token del QR generado para mostrarlo
        setGeneratedQR(data.qrCode);
        
        // Crear datos completos para el QR con el formato específico
        const completeQRData = {
          token: data.qrCode.token,
          guestName: guestName.trim(),
          phoneNumber: phoneNumber.trim(),
          reason: reason.trim(),
          expirationDate: selectedDate.toISOString(),
          createdBy: user?.name || 'Usuario'
        };
        setQrData(completeQRData);
        
        Alert.alert(
          '✅ ¡Código QR Creado!', 
          `Se ha generado exitosamente el código QR para ${guestName}. El código se muestra abajo.`,
          [
            {
              text: 'Ver Código',
              onPress: () => {
                // El QR ya se muestra automáticamente
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear el código QR');
      }
    } catch (error) {
      console.error('Error creating QR code:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>

        <Text style={styles.subtitle}>
          Rellena el formulario de acuerdo a la información de su invitado
        </Text>

        <TouchableOpacity 
          style={styles.viewListButton}
          onPress={() => navigation.navigate('QRList')}
        >
          <Text style={styles.viewListButtonText}>Ver mis códigos QR</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          {/* Nombre */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre del invitado</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa el nombre del invitado"
              placeholderTextColor={Colors.gray}
              value={guestName}
              onChangeText={setGuestName}
            />
          </View>

          {/* Teléfono */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa el número de teléfono"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Fecha */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Fecha</Text>
            <TouchableOpacity
              style={styles.input}
              activeOpacity={0.7}
              onPress={showDatePicker}
            >
              <Text style={selectedDate ? styles.placeholderText : styles.placeholderText}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={new Date()}
              is24Hour={true}
            />
          </View>

          {/* Motivo */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Motivo</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder="Ingresa el motivo de la visita"
              placeholderTextColor={Colors.gray}
              multiline
              value={reason}
              onChangeText={setReason}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          activeOpacity={0.85} 
          onPress={handleSubmit} 
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creando código QR...' : 'Solicitar código QR'}
          </Text>
        </TouchableOpacity>

        {/* Mostrar el código QR generado */}
        {generatedQR && (
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>✅ Código QR Generado</Text>
            <Text style={styles.qrSubtitle}>Para: {guestName}</Text>
            
            <ViewShot ref={qrRef} style={styles.qrCodeContainer}>
              <QRCode
                value={`Código QR de Acceso\n\nInvitado: ${qrData.guestName}\nTeléfono: ${qrData.phoneNumber}\nMotivo: ${qrData.reason}\nExpira: ${formatDate(qrData.expirationDate)}\n\nToken: ${qrData.token}`}
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
              <Text style={styles.tokenDisplay}>{generatedQR.token}</Text>
              <Text style={styles.scanText}>
                Escanea este código QR con cualquier app de QR para acceder
              </Text>
              <Text style={styles.scanText}>
                El QR contiene toda la información del invitado
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Invitado:</Text>
              <Text style={styles.infoValue}>{guestName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>{phoneNumber}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Motivo:</Text>
              <Text style={styles.infoValue}>{reason}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expira:</Text>
              <Text style={styles.infoValue}>{formatDate(generatedQR.expirationDate)}</Text>
            </View>
            
            <View style={styles.qrActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={clearForm}
              >
                <Text style={styles.actionButtonText}>Crear otro código</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={shareQRCode}
              >
                <Text style={styles.secondaryButtonText}>Compartir código QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 60,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.card,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  placeholderText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray,
    opacity: 0.7,
  },
  viewListButton: {
    backgroundColor: Colors.highlight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  viewListButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  qrContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  qrSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 15,
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
  qrActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
  },
  actionButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.highlight,
    borderWidth: 1,
    borderColor: Colors.primary,
    flex: 1,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
