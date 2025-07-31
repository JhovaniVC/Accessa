import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../themes/colors';
import { UserContext } from '../../context/UserContext';
import { buildApiUrl } from '../../config/api';



export default function ProfileScreen({navigation}) {
  const { user, logout } = useContext(UserContext);
  const [loggingOut, setLoggingOut] = useState(false);

  const goToDatos = () => navigation.navigate('Datos');
  const goToNoti = () => navigation.navigate('Notificaciones');
  const goToConf = () => navigation.navigate('Configuraciones');
  const goToApiConfig = () => navigation.navigate('ApiConfig');

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              // Llamada al backend para cerrar sesión
              const response = await fetch(buildApiUrl('/api/auth/logout'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
              });

              // Limpiar el contexto del usuario
              logout();
              
              // Navegar al login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
              
              Alert.alert('Sesión Cerrada', 'Has cerrado sesión exitosamente');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              // Aún así, limpiar el contexto y navegar al login
              logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Icon name="person" size={60} color="white" />
        </View>
        <Text style={styles.userName}>
          {user?.name || user?.email?.split('@')[0] || 'Usuario'}
        </Text>
        <Text style={styles.userEmail}>
          {user?.email || 'usuario@ejemplo.com'}
        </Text>
      </View>

      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={goToDatos}>
          <View style={styles.menuItemContent}>
            <Icon name="person-outline" size={24} color={Colors.primary} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Datos personales</Text>
            
          </View>
          <Icon name="chevron-right" size={24} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={goToNoti}>
          <View style={styles.menuItemContent}>
            <Icon name="notifications-none" size={24} color={Colors.primary} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Notificaciones</Text>
          </View>
          <Icon name="chevron-right" size={24} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={goToConf}>
          <View style={styles.menuItemContent}>
            <Icon name="settings" size={24} color={Colors.primary} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Configuraciones</Text>
          </View>
          <Icon name="chevron-right" size={24} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={goToApiConfig}>
          <View style={styles.menuItemContent}>
            <Icon name="wifi" size={24} color={Colors.primary} style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Configurar API</Text>
          </View>
          <Icon name="chevron-right" size={24} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]} 
        activeOpacity={0.85}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <View style={styles.logoutButtonContent}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.logoutButtonText}>CERRANDO SESIÓN...</Text>
          </View>
        ) : (
          <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
