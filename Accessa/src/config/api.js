// Configuración centralizada de la API
const API_CONFIG = {
  // Detectar automáticamente la IP o usar una por defecto
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http:// 192.168.1.64:3000',
  
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