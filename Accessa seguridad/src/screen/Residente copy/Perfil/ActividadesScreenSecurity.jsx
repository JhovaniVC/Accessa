import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../themes/colors';

export default function ActividadScreenSecurity() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      action: 'Iniciaste sesión',
      time: 'Hace 2 horas',
      icon: 'login',
      details: {
        tipo: 'Autenticación',
        dispositivo: 'Android',
        ip: '192.168.0.22',
        hora: '31/07/2025 08:45',
      },
    },
    {
      id: 2,
      action: 'Enviaste un reporte',
      time: 'Hace 5 horas',
      icon: 'report',
      details: {
        tipo: 'Reporte de incidente',
        ubicación: 'Av. Central #321',
        hora: '31/07/2025 06:10',
      },
    },
    {
      id: 3,
      action: 'Navegaste a “Mi perfil”',
      time: 'Ayer',
      icon: 'person',
      details: {
        tipo: 'Navegación',
        pantalla: 'Perfil',
        hora: '30/07/2025 20:15',
      },
    },
    {
      id: 4,
      action: 'Cerraste sesión',
      time: 'Hace 2 días',
      icon: 'logout',
      details: {
        tipo: 'Autenticación',
        dispositivo: 'Android',
        hora: '29/07/2025 19:55',
      },
    },
  ]);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Actividad del Usuario</Text>

      <ScrollView style={styles.scroll}>
        {activities.map((activity) => (
          <View key={activity.id} style={styles.card}>
            <View style={styles.row}>
              <Icon name={activity.icon} size={24} color={Colors.primary} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{activity.action}</Text>
                <Text style={styles.time}>{activity.time}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => handleViewDetails(activity)}
            >
              <Text style={styles.detailsButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal de detalles */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedActivity && (
              <>
                <View style={styles.modalHeader}>
                  <Icon name={selectedActivity.icon} size={26} color={Colors.primary} />
                  <Text style={styles.modalTitle}>{selectedActivity.action}</Text>
                  <Pressable onPress={closeModal}>
                    <Icon name="close" size={24} color={Colors.textSecondary} />
                  </Pressable>
                </View>

                <ScrollView style={styles.modalBody}>
                  {Object.entries(selectedActivity.details).map(([key, value]) => (
                    <View key={key} style={styles.detailRow}>
                      <Text style={styles.detailKey}>{key}:</Text>
                      <Text style={styles.detailValue}>{value}</Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.title,
    marginBottom: 16,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  time: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailsButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  detailsButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 14,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: Colors.title,
  },
  modalBody: {
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailKey: {
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
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: 'bold',
  },
});
