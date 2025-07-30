const QRCode = require('../models/qrCode');
const User = require('../models/user');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const QRCodeGenerator = require('qrcode');
const { logActivity } = require('./activityLog.controller');

// Generar un token único
const generateToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Crear un nuevo código QR
const createQRCode = async (req, res) => {
  try {
    const { information, expirationDate, userId } = req.body;

    // Verificar si el usuario existe
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generar un token único
    const token = generateToken();

    // Generar el código QR como imagen
    const qrImagePath = path.join('uploads', `qr-${token}.png`);
    const fullQrImagePath = path.join(__dirname, '../../', qrImagePath);
    
    await QRCodeGenerator.toFile(fullQrImagePath, token, {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300,
      margin: 2
    });

    const newQRCode = new QRCode({
      token,
      information,
      expirationDate,
      userId,
      qrImage: qrImagePath // Guardar la ruta de la imagen
    });

    await newQRCode.save();

    // Registrar la actividad
    await logActivity(
      userId,
      'QR_CREATED',
      `Código QR creado con información: ${information}`,
      newQRCode._id,
      'QRCode',
      { token, expirationDate }
    );

    res.status(201).json({
      message: 'QR code created successfully',
      qrCode: newQRCode
    });
  } catch (error) {
    console.error('Error creating QR code:', error);
    res.status(500).json({ message: 'Error creating QR code' });
  }
};

// Obtener todos los códigos QR
const getAllQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCode.find().populate('userId', '-password');
    res.status(200).json(qrCodes);
  } catch (error) {
    console.error('Error getting QR codes:', error);
    res.status(500).json({ message: 'Error getting QR codes' });
  }
};

// Obtener códigos QR por ID de usuario
const getQRCodesByUserId = async (req, res) => {
  try {
    const qrCodes = await QRCode.find({ userId: req.params.userId })
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(qrCodes);
  } catch (error) {
    console.error('Error getting QR codes by user ID:', error);
    res.status(500).json({ message: 'Error getting QR codes by user ID' });
  }
};

// Obtener un código QR por token
const getQRCodeByToken = async (req, res) => {
  try {
    const qrCode = await QRCode.findOne({ token: req.params.token }).populate('userId', '-password');
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    // Verificar si el código QR ha expirado
    if (new Date() > new Date(qrCode.expirationDate)) {
      return res.status(400).json({ message: 'QR code has expired' });
    }
    
    res.status(200).json(qrCode);
  } catch (error) {
    console.error('Error getting QR code by token:', error);
    res.status(500).json({ message: 'Error getting QR code by token' });
  }
};

// Acreditar un código QR
const acreditateQRCode = async (req, res) => {
  try {
    const updatedQRCode = await QRCode.findByIdAndUpdate(
      req.params.id,
      { acreditationDate: new Date() },
      { new: true }
    ).populate('userId', '-password');
    
    if (!updatedQRCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    res.status(200).json({
      message: 'QR code acreditated successfully',
      qrCode: updatedQRCode
    });
  } catch (error) {
    console.error('Error acreditating QR code:', error);
    res.status(500).json({ message: 'Error acreditating QR code' });
  }
};

// Registrar uso de un código QR
const registerQRCodeUse = async (req, res) => {
  try {
    const updatedQRCode = await QRCode.findByIdAndUpdate(
      req.params.id,
      { useDate: new Date() },
      { new: true }
    ).populate('userId', '-password');
    
    if (!updatedQRCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    // Registrar la actividad
    await logActivity(
      updatedQRCode.userId._id,
      'QR_USED',
      `Código QR utilizado: ${updatedQRCode.information}`,
      updatedQRCode._id,
      'QRCode',
      { useDate: new Date() }
    );
    
    res.status(200).json({
      message: 'QR code use registered successfully',
      qrCode: updatedQRCode
    });
  } catch (error) {
    console.error('Error registering QR code use:', error);
    res.status(500).json({ message: 'Error registering QR code use' });
  }
};

module.exports = {
  createQRCode,
  getAllQRCodes,
  getQRCodesByUserId,
  getQRCodeByToken,
  acreditateQRCode,
  registerQRCodeUse
};