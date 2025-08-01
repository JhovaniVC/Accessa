import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import ScreenHome from '../screen/Home/ScreenHome';
import ScreenHomeGuard from '../screen/Home/ScreenHomeGuard';

export default function RoleBasedHome({ navigation }) {
  const { isGuard, isResident } = useContext(UserContext);

  // Si es guardia, mostrar la pantalla de guardia
  if (isGuard()) {
    return <ScreenHomeGuard navigation={navigation} />;
  }

  // Si es residente o por defecto, mostrar la pantalla de residente
  return <ScreenHome navigation={navigation} />;
} 