import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Navegation from './Navegation';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <PaperProvider>
      <UserProvider>
        <Navegation />
      </UserProvider>
    </PaperProvider>
  );
}
