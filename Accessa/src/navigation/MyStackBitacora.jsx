import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BitacoraMenuScreen from '../screen/Bitacora/BitacoraMenuScreen';
import BitacoraScreen from '../screen/Bitacora/BitacoraScreen';
import BitacoraAccesosScreen from '../screen/Bitacora/BitacoraAccesosScreen';

const Stack = createStackNavigator();

export default function MyStackBitacora() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BitacoraMenu" component={BitacoraMenuScreen} options={{ title: 'Bitácora' }} />
      <Stack.Screen name="BitacoraGeneral" component={BitacoraScreen} options={{ title: 'Bitácora General' }} />
      <Stack.Screen name="BitacoraAccesos" component={BitacoraAccesosScreen} options={{ title: 'Bitácora de Accesos' }} />
    </Stack.Navigator>
  );
} 