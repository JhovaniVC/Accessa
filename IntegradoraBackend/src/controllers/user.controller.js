const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('roleId').select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Error getting users' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('roleId').select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Error getting user' });
  }
};

// Cambiar contraseña del usuario actual
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; // Obtenido del middleware de autenticación

    // Validaciones
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Obtener el usuario con la contraseña actual
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verificar la contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar la contraseña
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  try {
    const {
      name,
      paternalSurname,
      maternalSurname,
      email,
      phoneNumber,
      housingUnit,
      turn,
      password,
      roleName
    } = req.body;

    // Crear objeto con los datos a actualizar
    const updateData = {};
    
    if (name) updateData.name = name;
    if (paternalSurname) updateData.paternalSurname = paternalSurname;
    if (maternalSurname) updateData.maternalSurname = maternalSurname;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (housingUnit) updateData.housingUnit = housingUnit;
    if (turn) updateData.turn = turn;
    
    // Si se proporciona una contraseña, encriptarla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Si se proporciona un rol, obtener su ID
    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      updateData.roleId = role._id;
    }
    
    // Actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('roleId').select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Cambiar el estado de un usuario (activar/desactivar)
const changeUserState = async (req, res) => {
  try {
    const { state } = req.body;
    
    if (state === undefined) {
      return res.status(400).json({ message: 'State is required' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { state },
      { new: true }
    ).populate('roleId').select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: `User ${state ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error changing user state:', error);
    res.status(500).json({ message: 'Error changing user state' });
  }
};

// Eliminar un usuario (eliminación lógica)
const deleteUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { state: false },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  changePassword,
  updateUser,
  changeUserState,
  deleteUser
};