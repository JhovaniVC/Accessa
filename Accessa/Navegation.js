import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

//importciones de las pantallas usadas para la app
import ScreenHome from './src/screen/Home/ScreenHome';
import ScreenHomeGuard from './src/screen/Home/ScreenHomeGuard';
import ScreenLogin from './src/screen/Login/ScreenLogin';
import ScreenCodigoQR from './src/screen/CodigoQR/ScreenCodigoQR';
import ScreenCodigoQRGuard from './src/screen/CodigoQR/ScreenCodigoQRGuard';
import QRListScreen from './src/screen/CodigoQR/QRListScreen';
import ScreenPerfil from './src/screen/Perfil/ScreenPerfil';
import ScreenPanico from './src/screen/Panico/ScreenPanico';
import ScreenReportes from './src/screen/Reportes/ScreenReportes';
import ReportDetailsScreen from './src/screen/Reportes/ReportDetailsScreen';
import ReportDetailScreen from './src/screen/Reportes/ReportDetailScreen';
import ReportHistoryScreen from './src/screen/Reportes/ReportHistoryScreen';
import ScreenRegistro from './src/screen/Login/ScreenRegistro';
import ConfiguracionesScreen from './src/screen/Perfil/ConfiguracionesScreen';
import DatosScreen from './src/screen/Perfil/DatosScreen';
import NotificacionesScreen from './src/screen/Perfil/NotificacionesScreen';
import ApiConfig from './src/components/ApiConfig';
import RoleBasedHome from './src/components/RoleBasedHome';
import RoleBasedQR from './src/components/RoleBasedQR';
import RoleBasedReports from './src/components/RoleBasedReports';
import BitacoraMenuScreen from './src/screen/Bitacora/BitacoraMenuScreen';
import BitacoraScreen from './src/screen/Bitacora/BitacoraScreen';
import BitacoraAccesosScreen from './src/screen/Bitacora/BitacoraAccesosScreen';
import ScreenScannerQR from './src/screen/CodigoQR/ScreenScannerQR';

//importamos los estilos
import { Colors } from './src/themes/colors';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

import RoleBasedTabs from './src/components/RoleBasedTabs';

// --- Tabs principales ---
function MyTabs() {
    return <RoleBasedTabs />;
}

// --- Stack para Home (puedes expandir si tienes más pantallas desde Home) ---
function MyStackHome() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={ScreenHome} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

// --- Stack para QR (puedes expandir si tienes más pantallas desde QR) ---
function MyStackQR() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="QRCreator" component={RoleBasedQR} options={{ headerShown: false }} />
            <Stack.Screen name="QRList" component={QRListScreen} options={{ title: 'Mis Códigos QR' }} />
            <Stack.Screen name="Scanner" component={ScreenScannerQR} options={{ title: 'Escanear QR' }} />
        </Stack.Navigator>
    );
}

// --- Stack para Bitácora ---
function MyStackBitacora() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="BitacoraMenu" component={BitacoraMenuScreen} options={{ title: 'Bitácora' }} />
            <Stack.Screen name="BitacoraGeneral" component={BitacoraScreen} options={{ title: 'Bitácora General' }} />
            <Stack.Screen name="BitacoraAccesos" component={BitacoraAccesosScreen} options={{ title: 'Bitácora de Accesos' }} />
        </Stack.Navigator>
    );
}

// --- Stack para Perfil (puedes expandir si tienes más pantallas desde Perfil) ---
function MyStackUser() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Perfil" component={ScreenPerfil} options={{ headerShown: false }} />
            <Stack.Screen name="Configuraciones" component={ConfiguracionesScreen} />
            <Stack.Screen name="Datos" component={DatosScreen} />
            <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
            <Stack.Screen name="ApiConfig" component={ApiConfig} options={{ title: 'Configurar API' }} />
        </Stack.Navigator>
    );
}

// --- Stack principal: Login -> Tabs ---
function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={ScreenLogin} />
            <Stack.Screen name="MainTabs" component={MyTabs} />
                    <Stack.Screen name="ReportHistory" component={ReportHistoryScreen} options={{ title: 'Mi Historial de Reportes' }} />
        <Stack.Screen name="QRList" component={QRListScreen} options={{ title: 'Mi Historial de Códigos QR' }} />
        <Stack.Screen name="ReportDetails" component={ReportDetailScreen} options={{ title: 'Detalles del Reporte' }} />
        <Stack.Screen name="Panico" component={ScreenPanico} options={{ title: 'Botón de Emergencia' }} />
        <Stack.Screen name="Scanner" component={ScreenScannerQR} options={{ title: 'Escanear QR' }} />
        </Stack.Navigator>
    );
}

export default function Navegation() {
    return (
        <NavigationContainer>
            <MainStack />
        </NavigationContainer>
    );
}

