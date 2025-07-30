const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Role = require('../models/role');
const { createToken } = require('../libs/jwt');
const { ROLES } = require('../schemas/role.enum');

// Registrar un nuevo usuario
const register = async (req, res) => {
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
      roleName = ROLES.RESIDENT
    } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Obtener el rol
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = new User({
      roleId: role._id,
      name,
      paternalSurname,
      maternalSurname,
      email,
      phoneNumber,
      housingUnit,
      turn,
      password: hashedPassword
    });

    // Guardar el usuario
    await newUser.save();

    // Generar token
    const token = await createToken({ id: newUser._id });

    // Establecer cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    // Responder sin incluir la contraseña
    const userWithoutPassword = { ...newUser._doc };
    delete userWithoutPassword.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email }).populate('roleId');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verificar si el usuario está activo
    if (!user.state) {
      return res.status(401).json({ message: 'User is inactive' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generar token
    const token = await createToken({ id: user._id });

    // Establecer cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    // Responder sin incluir la contraseña
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Cerrar sesión
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

// Verificar el estado de autenticación
const verifyAuth = async (req, res) => {
  try {
    // El middleware validateToken ya verificó el token y agregó el usuario a req.user
    const userWithoutPassword = { ...req.user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({
      authenticated: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error verifying authentication:', error);
    res.status(500).json({ message: 'Error verifying authentication' });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyAuth
};