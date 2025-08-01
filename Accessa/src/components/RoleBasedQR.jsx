import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import ScreenCodigoQR from '../screen/CodigoQR/ScreenCodigoQR';
import ScreenCodigoQRGuard from '../screen/CodigoQR/ScreenCodigoQRGuard';

export default function RoleBasedQR({ navigation }) {
  const { isGuard, isResident } = useContext(UserContext);

  // Si es guardia, mostrar la pantalla de QR para guardias
  if (isGuard()) {
    return <ScreenCodigoQRGuard navigation={navigation} />;
  }

  // Si es residente o por defecto, mostrar la pantalla de QR para residentes
  return <ScreenCodigoQR navigation={navigation} />;
} 