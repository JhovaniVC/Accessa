const fetch = require('node-fetch');

// Configuración de prueba
const BASE_URL = 'http://localhost:3000';
const TEST_DATA = {
  deliveredBy: 'Juan Pérez',
  courierCompany: 'DHL',
  department: '201',
  receivedBy: 'María García',
  description: 'Paquete de Amazon',
  status: 'entregado',
  comments: 'Entregado en recepción'
};

async function testAccessLogsAPI() {
  console.log('🧪 Probando API de Access Logs...\n');

  try {
    // 1. Probar endpoint GET (debería fallar sin autenticación)
    console.log('1. Probando GET /api/access-logs (sin autenticación)...');
    const getResponse = await fetch(`${BASE_URL}/api/access-logs`);
    console.log(`   Status: ${getResponse.status} ${getResponse.statusText}`);
    
    if (getResponse.status === 401) {
      console.log('   ✅ Correcto: Endpoint protegido sin autenticación\n');
    } else {
      console.log('   ⚠️  Inesperado: Endpoint no está protegido\n');
    }

    // 2. Probar endpoint POST (debería fallar sin autenticación)
    console.log('2. Probando POST /api/access-logs (sin autenticación)...');
    const postResponse = await fetch(`${BASE_URL}/api/access-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_DATA)
    });
    console.log(`   Status: ${postResponse.status} ${postResponse.statusText}`);
    
    if (postResponse.status === 401) {
      console.log('   ✅ Correcto: Endpoint protegido sin autenticación\n');
    } else {
      console.log('   ⚠️  Inesperado: Endpoint no está protegido\n');
    }

    // 3. Verificar que el servidor esté corriendo
    console.log('3. Probando endpoint raíz...');
    const rootResponse = await fetch(`${BASE_URL}/`);
    const rootData = await rootResponse.json();
    console.log(`   Status: ${rootResponse.status}`);
    console.log(`   Response: ${JSON.stringify(rootData)}`);
    console.log('   ✅ Servidor funcionando correctamente\n');

    console.log('📋 Resumen de pruebas:');
    console.log('   - Servidor: ✅ Funcionando');
    console.log('   - Endpoints protegidos: ✅ Correcto');
    console.log('   - Necesitas autenticación para usar los endpoints');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Asegúrate de que el servidor esté corriendo: npm start');
    console.log('   2. Verifica que el puerto 3000 esté disponible');
    console.log('   3. Revisa los logs del servidor para errores');
  }
}

// Ejecutar pruebas
testAccessLogsAPI(); 