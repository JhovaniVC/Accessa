const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/user');
const Role = require('./src/models/role');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Buscar el rol admin
    let adminRole = await Role.findOne({ name: 'admin' });

    if (!adminRole) {
      console.log('No existe el rol admin. Créalo primero o agrega manualmente el rol admin.');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Ya existe un usuario admin con ese email.');
      process.exit(1);
    }

    // Encriptar la contraseña 'pro'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('pro', salt);

    const newAdmin = new User({
      roleId: adminRole._id,
      name: 'Admin',
      paternalSurname: 'Super',
      maternalSurname: 'User',
      email: 'admin@example.com',
      phoneNumber: '1234567890',
      housingUnit: '',
      turn: '',
      password: hashedPassword,
      state: true
    });

    await newAdmin.save();
    console.log('Nuevo usuario admin creado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error creando admin:', error);
    process.exit(1);
  }
}

createAdmin();
