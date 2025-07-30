const mongoose = require('mongoose');
require('dotenv').config();

const Role = require('./src/models/role');
const { ROLES } = require('./src/schemas/role.enum');

async function createRoles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.CONNECTION_STRING);
    console.log('Conectado a MongoDB');

    // Crear roles si no existen
    const rolesToCreate = [
      { name: ROLES.ADMIN },
      { name: ROLES.USER },
      { name: ROLES.GUARD },
      { name: ROLES.RESIDENT }
    ];

    for (const roleData of rolesToCreate) {
      const existingRole = await Role.findOne({ name: roleData.name });
      
      if (!existingRole) {
        const newRole = new Role(roleData);
        await newRole.save();
        console.log(`Rol "${roleData.name}" creado exitosamente`);
      } else {
        console.log(`Rol "${roleData.name}" ya existe`);
      }
    }

    console.log('Todos los roles han sido inicializados');
    process.exit(0);
  } catch (error) {
    console.error('Error creando roles:', error);
    process.exit(1);
  }
}

createRoles(); 