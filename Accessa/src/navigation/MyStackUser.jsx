import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScreenPerfil from '../screen/Perfil/ScreenPerfil';
import ConfiguracionesScreen from '../screen/Perfil/ConfiguracionesScreen';
import DatosScreen from '../screen/Perfil/DatosScreen';
import NotificacionesScreen from '../screen/Perfil/NotificacionesScreen';
import ApiConfig from '../components/ApiConfig';
import ReportHistoryScreen from '../screen/Reportes/ReportHistoryScreen';
import QRListScreen from '../screen/CodigoQR/QRListScreen';

const Stack = createStackNavigator();

export default function MyStackUser() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={ScreenPerfil} options={{ headerShown: false }} />
      <Stack.Screen name="Configuraciones" component={ConfiguracionesScreen} />
      <Stack.Screen name="Datos" component={DatosScreen} />
      <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
      <Stack.Screen name="ApiConfig" component={ApiConfig} options={{ title: 'Configurar API' }} />
      <Stack.Screen name="ReportHistory" component={ReportHistoryScreen} options={{ title: 'Mi Historial de Reportes' }} />
      <Stack.Screen name="QRList" component={QRListScreen} options={{ title: 'Mi Historial de Códigos QR' }} />
    </Stack.Navigator>
  );
} 