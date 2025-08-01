# 🔧 Guía de Debugging - Formulario de Bitácora de Accesos

## 🚨 Problemas Comunes y Soluciones

### 1. **El formulario no guarda datos**

#### Verificar Backend:
```bash
# En la carpeta IntegradoraBackend
cd IntegradoraBackend
npm start
```

#### Verificar que el servidor esté corriendo:
```bash
# Probar el endpoint raíz
curl http://localhost:3000/
# Debería devolver: {"message":"Integradora Backend API"}
```

#### Probar el endpoint de access-logs:
```bash
# En IntegradoraBackend
node test-access-logs.js
```

### 2. **Problemas de Conexión**

#### Verificar configuración de API:
```javascript
// En Accessa seguridad/src/config/api.js
// Asegúrate de que la IP sea correcta
BASE_URL: 'http://192.168.1.64:3000' // Cambia por tu IP
```

#### Para encontrar tu IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

### 3. **Problemas de Autenticación**

#### Verificar que el usuario esté logueado:
1. Abre la consola de React Native
2. Presiona el botón "Debug (Ver consola)"
3. Verifica que `user` no sea `null`

#### Si el usuario es null:
1. Ve a la pantalla de login
2. Inicia sesión con un usuario de seguridad
3. Regresa al formulario

### 4. **Problemas de Validación**

#### Verificar campos obligatorios:
- ✅ ¿Quién entrega?
- ✅ Paquetería
- ✅ Departamento
- ✅ ¿Quién recibe?

#### Los campos opcionales son:
- Descripción del paquete
- Comentarios adicionales

### 5. **Problemas de Base de Datos**

#### Verificar conexión a MongoDB:
```bash
# En IntegradoraBackend
# Verifica que MongoDB esté corriendo
mongo
# o
mongosh
```

#### Verificar variables de entorno:
```bash
# En IntegradoraBackend/.env
MONGODB_URI=mongodb://localhost:27017/accessa_db
```

## 🧪 Pasos para Probar

### Paso 1: Verificar Backend
```bash
cd IntegradoraBackend
npm start
```

### Paso 2: Verificar Frontend
```bash
cd "Accessa seguridad"
npm start
```

### Paso 3: Probar Formulario
1. Abre la app en el emulador/dispositivo
2. Inicia sesión como usuario de seguridad
3. Ve a Bitácora → Nuevo Registro de Acceso
4. Llena el formulario con datos de prueba:
   - Entregador: "Juan Pérez"
   - Paquetería: "DHL"
   - Departamento: "201"
   - Receptor: "María García"
   - Estado: "Entregado"
5. Presiona "Guardar"
6. Revisa la consola para logs de debug

### Paso 4: Verificar en Base de Datos
```bash
# Conectar a MongoDB
mongo
use accessa_db
db.accesslogs.find().pretty()
```

## 🔍 Logs de Debug

### En la Consola de React Native verás:
```
Estado actual del formulario: {deliveredBy: "Juan Pérez", ...}
Usuario actual: {_id: "...", name: "...", role: "guard"}
Validando formulario... {deliveredBy: "Juan Pérez", ...}
Formulario válido
Enviando datos al servidor: {deliveredBy: "Juan Pérez", ...}
URL de la API: http://192.168.1.64:3000/api/access-logs
Respuesta del servidor: 201 Created
Datos de respuesta: {message: "Registro de acceso creado exitosamente", ...}
```

### Si hay errores:
```
Error del servidor: {message: "Error al crear el registro de acceso"}
Error de conexión: [Error object]
```

## 🛠️ Soluciones Rápidas

### Si el servidor no responde:
1. Verifica que esté corriendo en el puerto correcto
2. Revisa los logs del servidor
3. Verifica que no haya errores de sintaxis

### Si hay errores de autenticación:
1. Verifica que el token JWT sea válido
2. Reinicia la sesión
3. Verifica que el usuario tenga rol de guardia

### Si hay errores de base de datos:
1. Verifica que MongoDB esté corriendo
2. Verifica la conexión en `db.js`
3. Revisa los logs de MongoDB

## 📱 Comandos Útiles

### Reiniciar servidor:
```bash
# En IntegradoraBackend
npm start
```

### Limpiar cache de React Native:
```bash
# En Accessa seguridad
npx react-native start --reset-cache
```

### Ver logs en tiempo real:
```bash
# Para ver logs del servidor
tail -f IntegradoraBackend/logs.txt

# Para ver logs de React Native
npx react-native log-android
# o
npx react-native log-ios
```

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 3000
- [ ] MongoDB conectado y funcionando
- [ ] Usuario autenticado con rol de guardia
- [ ] IP del servidor configurada correctamente
- [ ] Formulario con todos los campos obligatorios
- [ ] Sin errores en la consola
- [ ] Respuesta exitosa del servidor
- [ ] Datos guardados en la base de datos

## 🆘 Si Nada Funciona

1. **Revisa los logs completos** del servidor y la app
2. **Verifica la red** - asegúrate de que la IP sea accesible
3. **Prueba con Postman** para aislar el problema
4. **Revisa la documentación** de las dependencias
5. **Busca errores similares** en Stack Overflow

---

**¿Necesitas ayuda específica?** Comparte los logs de error y te ayudo a solucionarlo. 