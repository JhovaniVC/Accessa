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
import ScreenHome from './src/screen/Residente/Home/ScreenHome';
import ScreenLogin from './src/screen/Residente/Login/ScreenLogin';
import ScreenCodigoQR from './src/screen/Residente/CodigoQR/ScreenCodigoQR';
import QRListScreen from './src/screen/Residente/CodigoQR/QRListScreen';
import ScreenPerfil from './src/screen/Residente/Perfil/ScreenPerfil';
import ScreenPanico from './src/screen/Residente/Panico/ScreenPanico';
import ScreenReportes from './src/screen/Residente/Reportes/ScreenReportes';
import ReportDetailsScreen from './src/screen/Residente/Reportes/ReportDetailsScreen';
import ConfiguracionesScreen from './src/screen/Residente/Perfil/ConfiguracionesScreen';
import DatosScreen from './src/screen/Residente/Perfil/DatosScreen';
import NotificacionesScreen from './src/screen/Residente/Perfil/NotificacionesScreen';
import ActividadScreen from './src/screen/Residente/Perfil/ActividadesScreen';

// Importamos las pantallas desde la carpeta principal "Residente copy"
import ScreenHomeSecurity from './src/screen/Residente copy/Home/ScreenHomeSecurity';
import BitacoraAccesosScreen from './src/screen/Residente copy/Bitacora/BitacoraAccesosScreen';
import BitacoraScreen from './src/screen/Residente copy/Bitacora/BitacoraScreen';
import ScreenCodigoQRSecurity from './src/screen/Residente copy/CodigoQR/ScreenCodigoQRSecurity';
import QRListScreenSecurity from './src/screen/Residente copy/CodigoQR/QRListScreenSecurity';
import ScreenPanicoSecurity from './src/screen/Residente copy/Panico/ScreenPanicoSecurity';
import ActividadScreenSecurity from './src/screen/Residente copy/Perfil/ActividadesScreenSecurity';
import ConfiguracionesScreenSecurity from './src/screen/Residente copy/Perfil/ConfiguracionesScreenSecurity';
import DatosScreenSecurity from './src/screen/Residente copy/Perfil/DatosScreenSecurity';
import NotificacionesScreenSecurity from './src/screen/Residente copy/Perfil/NotificacionesScreenSecurity';
import PerfilScreenSecurity from './src/screen/Residente copy/Perfil/ScreenPerfilSecurity';
import ReportDetailsScreenSecurity from './src/screen/Residente copy/Reportes/ReportDetailsScreenSecurity';
import ScreenReportesSecurity from './src/screen/Residente copy/Reportes/ScreenReportesSecurity';
import BitacoraMenuScreen from './src/screen/Residente copy/Bitacora/BitacoraMenuScreen';
import ScreenScannerQR from './src/screen/Residente copy/CodigoQR/ScreenScannerQR';

//importamos los estilos
import { Colors } from './src/themes/colors';
import ProfileScreen from './src/screen/Residente/Perfil/ScreenPerfil';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();


// --- Stack principal: Login -> Tabs ---
function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Login" component={ScreenLogin} />
            <Stack.Screen name="MainTabsResident" component={MyTabsResidente} />
            <Stack.Screen name="MainTabsSecurity" component={MyTabsSeguridad} />
        </Stack.Navigator>
    );
}

// --- Tabs residentes ---
function MyTabsResidente() {
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
            <Tabs.Screen name="Inicio" component={MyStackHomeResidente}
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
            <Tabs.Screen name="QR" component={MyStackQRResidente}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="qrcode" size={size} color={color} />
                    )
                }} />
            <Tabs.Screen name="Perfil" component={MyStackUserResidente}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    )
                }} />
        </Tabs.Navigator>
    )
}

function MyStackHomeResidente() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={ScreenHome} options={{ headerShown: false }} />
            <Stack.Screen name="QR" component={ScreenCodigoQR} options={{
            }} />
            <Stack.Screen name="Perfil" component={ScreenPerfil} options={{
            }} />
            <Stack.Screen name="Reportes" component={ScreenReportes} options={{
            }} />
            <Stack.Screen name="Panico" component={ScreenPanico} options={{}} />
            <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{ title: 'Detalles de Reportes' }} />
            <Stack.Screen name="QRList" component={QRListScreen} options={{ title: 'Mis Códigos QR' }} />
        </Stack.Navigator>
    );
}


function MyStackQRResidente() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="QRCreator" component={ScreenCodigoQR} options={{ headerShown: false }} />
            <Stack.Screen name="QRList" component={QRListScreen} options={{ title: 'Mis Códigos QR' }} />
        </Stack.Navigator>
    );
}

function MyStackUserResidente() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Perfil" component={ScreenPerfil} options={{ headerShown: false }} />
            <Stack.Screen name="Configuraciones" component={ConfiguracionesScreen} />
            <Stack.Screen name="Datos" component={DatosScreen} />
            <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
            <Stack.Screen name="Actividades" component={ActividadScreen} />
        </Stack.Navigator>
    );
}


// Tabs Seguridad
function MyTabsSeguridad() {
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
            <Tabs.Screen name="Inicio" component={MyStackHomeSeguridad}
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
            <Tabs.Screen name="Bitacora" component={BitacoraMenuScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="book" size={size} color={color} />
                    )
                }} />
            <Tabs.Screen name="QR" component={MyStackQRSeguridad}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="qrcode" size={size} color={color} />
                    )
                }} />
            <Tabs.Screen name="Perfil" component={MyStackUserSeguridad}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    )
                }} />

        </Tabs.Navigator>
    )
}

function MyStackHomeSeguridad() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={ScreenHomeSecurity} options={{ headerShown: false }} />
            <Stack.Screen name="QR" component={ScreenCodigoQRSecurity} options={{
            }} />
            <Stack.Screen name="Perfil" component={PerfilScreenSecurity} options={{
            }} />
            <Stack.Screen name="Reportes" component={ScreenReportesSecurity} options={{
            }} />
            <Stack.Screen name="Panico" component={ScreenPanico} options={{}} />
            <Stack.Screen name="ReportDetails" component={ReportDetailsScreenSecurity} options={{ title: 'Detalles de Reportes' }} />
            <Stack.Screen name="QRList" component={QRListScreenSecurity} options={{ title: 'Mis Códigos QR' }} />
            <Stack.Screen name="Bitacora" component={MyStackBitacoras} options={{ title: 'Bitacora' }} />
        </Stack.Navigator>
    );
}

function MyStackQRSeguridad() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="QR" component={ScreenCodigoQRSecurity} options={{ headerShown: false }} />
            <Stack.Screen name="QRList" component={QRListScreenSecurity} options={{ title: 'Mis Códigos QR' }} />
                        <Stack.Screen name="Scanner" component={ScreenScannerQR} options={{ title: 'Escaner QR' }} />
        </Stack.Navigator>
    );
}

function MyStackUserSeguridad() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Perfil" component={ScreenPerfil} options={{ headerShown: false }} />
            <Stack.Screen name="Configuraciones" component={ConfiguracionesScreen} />
            <Stack.Screen name="Datos" component={DatosScreen} />
            <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
            <Stack.Screen name="Actividades" component={ActividadScreen} />
        </Stack.Navigator>
    );
}

function MyStackBitacoras() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Menu" component={BitacoraMenuScreen} options={{ headerShown:false }} />
            <Stack.Screen name="Accesos" component={BitacoraAccesosScreen} options={{ headerShown:false }} />
            <Stack.Screen name="Personal" component={BitacoraScreen} options={{ headerShown:false }} />
        </Stack.Navigator>
    );
}


export default function Navegation() {
    return (
        <NavigationContainer>
            <MyTabsSeguridad />
        </NavigationContainer>
    );
}
