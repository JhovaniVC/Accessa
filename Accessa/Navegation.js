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
import ScreenLogin from './src/screen/Login/ScreenLogin';
import ScreenCodigoQR from './src/screen/CodigoQR/ScreenCodigoQR';
import QRListScreen from './src/screen/CodigoQR/QRListScreen';
import ScreenPerfil from './src/screen/Perfil/ScreenPerfil';
import ScreenPanico from './src/screen/Panico/ScreenPanico';
import ScreenReportes from './src/screen/Reportes/ScreenReportes';
import ReportDetailsScreen from './src/screen/Reportes/ReportDetailsScreen';
import ScreenRegistro from './src/screen/Login/ScreenRegistro';
import ConfiguracionesScreen from './src/screen/Perfil/ConfiguracionesScreen';
import DatosScreen from './src/screen/Perfil/DatosScreen';
import NotificacionesScreen from './src/screen/Perfil/NotificacionesScreen';

//importamos los estilos
import { Colors } from './src/themes/colors';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

// --- Tabs principales ---
function MyTabs() {
    return (
        <Tabs.Navigator
            screenOptions={{
                tabBarActiveTintColor: Colors.textPrimary,
                tabBarInactiveTintColor: Colors.background,
                tabBarActiveBackgroundColor: Colors.background,
                headerBackTitle: 'Custom Back',
                headerBackTitleStyle: { fontSize: 30 },
                headerTitleAlign: 'center',
                headerShown: true,
                headerTintColor: Colors.background,
                headerTitleStyle: {
                    color: Colors.background,
                    fontWeight: 'bold',
                    justifyContent: 'center'
                },
                headerStyle: {
                    backgroundColor: Colors.textPrimary,
                },
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: {
                    backgroundColor: Colors.textPrimary,
                    borderTopWidth: 0,
                    position: 'absolute',
                },
            }}
        >
            <Tabs.Screen name="Inicio" component={MyStackHome}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="home" size={size} color={color} />
                    ),
                }} />
            <Tabs.Screen name="Panico" component={ScreenPanico}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="alert-octagon" size={size} color={color} />
                    )
                }} />
            <Tabs.Screen name="Reportes" component={ScreenReportes}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="file" size={size} color={color} />
                    )
                }} />
            <Tabs.Screen name="QR" component={MyStackQR}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="qrcode" size={size} color={color} />
                    )
                }} />
            <Tabs.Screen name="Perfil" component={MyStackUser}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    )
                }} />
        </Tabs.Navigator>
    )
}

// --- Stack para Home (puedes expandir si tienes más pantallas desde Home) ---
function MyStackHome() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={ScreenHome} options={{ headerShown: false }} />
            <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{ title: 'Detalles de Reportes' }} />
        </Stack.Navigator>
    );
}

// --- Stack para QR (puedes expandir si tienes más pantallas desde QR) ---
function MyStackQR() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="QRCreator" component={ScreenCodigoQR} options={{ headerShown: false }} />
            <Stack.Screen name="QRList" component={QRListScreen} options={{ title: 'Mis Códigos QR' }} />
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
        </Stack.Navigator>
    );
}

// --- Stack principal: Login -> Tabs ---
function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={ScreenLogin} />
            <Stack.Screen name="MainTabs" component={MyTabs} />
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

