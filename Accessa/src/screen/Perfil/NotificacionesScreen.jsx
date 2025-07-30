import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../themes/colors';

export default function NotificacionesScreen() {
  // Datos de ejemplo para notificaciones con detalles extendidos
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Reporte enviado exitosamente',
      time: 'Hace 7 horas',
      read: false,
      icon: 'check-circle',
      details: {
        type: 'Reporte de incidente',
        date: '15/03/2023 14:30',
        location: 'Calle Principal #123',
        description: 'Se reportó un incidente en el área designada. El equipo de respuesta ha sido notificado.'
      }
    },
    {
      id: 2,
      title: 'Tu solicitud ha sido aceptada',
      time: 'Hace 12 horas',
      read: true,
      icon: 'assignment-turned-in',
      details: {
        type: 'Solicitud de acceso',
        date: '15/03/2023 09:15',
        status: 'Aprobada',
        comments: 'Tu solicitud ha sido revisada y aprobada por el administrador.'
      }
    },
    {
      id: 3,
      title: 'Tu contraseña ha sido cambiada',
      time: 'Hace 23 horas',
      read: false,
      icon: 'security',
      details: {
        type: 'Seguridad',
        date: '14/03/2023 16:45',
        device: 'Dispositivo móvil (Android)',
        ip: '192.168.1.100'
      }
    },
    {
      id: 4,
      title: 'Has usado el botón de pánico',
      time: 'Hace 7 días',
      read: false,
      icon: 'warning',
      details: {
        type: 'Emergencia',
        date: '08/03/2023 18:20',
        location: 'Avenida Central #456',
        responseTime: '2 minutos',
        status: 'Atendida'
      }
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    
    // Marcar como leída al abrir los detalles
    if (!notification.read) {
      setNotifications(notifications.map(item => 
        item.id === notification.id ? { ...item, read: true } : item
      ));
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      
      <ScrollView style={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <View 
            key={notification.id} 
            style={[
              styles.notificationItem,
              notification.read && styles.readNotification
            ]}
          >
            <View style={styles.notificationHeader}>
              <Icon 
                name={notification.icon} 
                size={24} 
                color={notification.read ? Colors.textSecondary : Colors.primary} 
                style={styles.notificationIcon}
              />
              <View style={styles.notificationText}>
                <Text style={[
                  styles.notificationTitle,
                  notification.read && styles.readTitle
                ]}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => handleViewDetails(notification)}
            >
              <Text style={styles.detailsButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal de detalles */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedNotification && (
              <>
                <View style={styles.modalHeader}>
                  <Icon 
                    name={selectedNotification.icon} 
                    size={28} 
                    color={Colors.primary} 
                  />
                  <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                  <Pressable onPress={closeModal} style={styles.closeButton}>
                    <Icon name="close" size={24} color={Colors.textSecondary} />
                  </Pressable>
                </View>
                
                <ScrollView style={styles.modalBody}>
                  {Object.entries(selectedNotification.details).map(([key, value]) => (
                    <View key={key} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{key}:</Text>
                      <Text style={styles.detailValue}>{value}</Text>
                    </View>
                  ))}
                </ScrollView>
                
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.profileButton}>
        <Text style={styles.profileButtonText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.title,
    marginBottom: 20,
    textAlign: 'center',
  },
  notificationsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: Colors.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  readNotification: {
    opacity: 0.8,
    backgroundColor: Colors.grayLight,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  readTitle: {
    color: Colors.textSecondary,
    fontWeight: 'normal',
  },
  notificationTime: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailsButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  detailsButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 14,
  },
  profileButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.title,
    marginLeft: 10,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: '40%',
    fontWeight: 'bold',
    color: Colors.text,
  },
  detailValue: {
    flex: 1,
    color: Colors.textSecondary,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: 'bold',
  },
});

