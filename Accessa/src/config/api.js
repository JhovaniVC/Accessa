// Configuración centralizada de la API
const API_CONFIG = {
  // Función para detectar automáticamente la IP del servidor
  async detectServerIP() {
    const possibleIPs = [
      'http://172.16.52.86:3000',  // Tu IP actual
      'http://192.168.1.225:3000', // IP anterior
      'http://localhost:3000',      // Para desarrollo local
      'http://10.0.0.1:3000',      // Redes comunes
      'http://192.168.0.1:3000',   // Redes comunes
      'http://192.168.1.1:3000',   // Redes comunes
      // Opción con dominio DNS dinámico (descomenta si tienes uno)
      // 'https://tu-dominio.ddns.net:3000',
    ];

    for (const ip of possibleIPs) {
      try {
        const response = await fetch(`${ip}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test', password: 'test' }),
          timeout: 3000, // 3 segundos de timeout
        });
        
        if (response.status !== 400) { // Si no es 400 (credenciales inválidas), el servidor existe
          console.log(`Servidor detectado en: ${ip}`);
          return ip;
        }
      } catch (error) {
        console.log(`No se pudo conectar a: ${ip}`);
      }
    }
    
    // Si no se encuentra, usar la IP por defecto
    return process.env.EXPO_PUBLIC_API_URL || 'http://172.16.52.86:3000';
  },

  // IP base (se actualizará automáticamente)
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://172.16.52.86:3000',
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REPORTS: '/api/reports',
    USER_REPORTS: (userId) => `/api/reports/user/${userId}`,
    QR_CODES: '/api/qr-codes',
    USER_QR_CODES: (userId) => `/api/qr-codes/user/${userId}`,
    UPLOADS: '/uploads'
  }
};

// Función para inicializar la detección automática
export const initializeApiConfig = async () => {
  try {
    const detectedIP = await API_CONFIG.detectServerIP();
    API_CONFIG.BASE_URL = detectedIP;
    console.log('API configurada automáticamente en:', detectedIP);
    return detectedIP;
  } catch (error) {
    console.error('Error detectando servidor:', error);
    return API_CONFIG.BASE_URL;
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función helper para URLs de imágenes
export const buildImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const cleanPath = imagePath.replace(/\\/g, '/');
  return `${API_CONFIG.BASE_URL}/${cleanPath}`;
};

// Función para cambiar la IP dinámicamente (útil para desarrollo)
export const setApiBaseUrl = (newBaseUrl) => {
  API_CONFIG.BASE_URL = newBaseUrl;
};

// Función para obtener la IP actual
export const getCurrentApiUrl = () => {
  return API_CONFIG.BASE_URL;
};

export default API_CONFIG; 