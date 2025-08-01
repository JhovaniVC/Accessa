import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { Colors } from '../themes/colors';
import { UserContext } from '../context/UserContext';
import RoleBasedHome from './RoleBasedHome';
import RoleBasedQR from './RoleBasedQR';
import RoleBasedReports from './RoleBasedReports';
import ScreenPanico from '../screen/Panico/ScreenPanico';
import MyStackUser from '../navigation/MyStackUser';
import MyStackBitacora from '../navigation/MyStackBitacora';
import QRListScreen from '../screen/CodigoQR/QRListScreen';
import ReportHistoryScreen from '../screen/Reportes/ReportHistoryScreen';

const Tabs = createBottomTabNavigator();

export default function RoleBasedTabs() {
  const { isGuard } = useContext(UserContext);

  const screenOptions = {
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
  };

  if (isGuard()) {
    // Navegación para Guardias
    return (
      <Tabs.Navigator screenOptions={screenOptions}>
        <Tabs.Screen 
          name="Inicio" 
          component={RoleBasedHome}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Entypo name="home" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="Reportes" 
          component={RoleBasedReports}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="file" size={size} color={color} />
            )
          }} 
        />
        <Tabs.Screen 
          name="QR" 
          component={RoleBasedQR}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="qrcode" size={size} color={color} />
            )
          }} 
        />
        <Tabs.Screen 
          name="Bitácora" 
          component={MyStackBitacora}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="notebook" size={size} color={color} />
            )
          }} 
        />
        <Tabs.Screen 
          name="Perfil" 
          component={MyStackUser}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            )
          }} 
        />
      </Tabs.Navigator>
    );
  }

  // Navegación para Residentes
  return (
    <Tabs.Navigator screenOptions={screenOptions}>
      <Tabs.Screen 
        name="Inicio" 
        component={RoleBasedHome}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="Panico" 
        component={ScreenPanico}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="alert-octagon" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="Reportes" 
        component={RoleBasedReports}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="file" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="QR" 
        component={RoleBasedQR}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="qrcode" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="Perfil" 
        component={MyStackUser}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          )
        }} 
      />
    </Tabs.Navigator>
  );
} 