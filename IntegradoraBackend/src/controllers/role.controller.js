const Role = require('../models/role');

const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    // Se pone todo en mayuscula para evitar confusion de roles
    const roleName = name.trim().toLowerCase();

    const existingRole = await Role.findOne({ name: roleName });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const newRole = new Role({ name: roleName });
    await newRole.save();

    res.status(201).json({ message: 'Role created', role: newRole });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Opcional: obtener todos los roles (frontend)
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error getting roles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRole,
  getAllRoles
};
