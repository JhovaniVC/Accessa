import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import ScreenReportesResident from '../screen/Reportes/ScreenReportesResident';
import ScreenReportesGuard from '../screen/Reportes/ScreenReportesGuard';

export default function RoleBasedReports({ navigation }) {
  const { isGuard, isResident } = useContext(UserContext);

  // Si es guardia, mostrar la pantalla de reportes para guardias
  if (isGuard()) {
    return <ScreenReportesGuard navigation={navigation} />;
  }

  // Si es residente o por defecto, mostrar la pantalla de reportes para residentes
  return <ScreenReportesResident navigation={navigation} />;
} 