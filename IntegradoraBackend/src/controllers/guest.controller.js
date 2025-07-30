const Guest = require('../models/guest');
const QRCode = require('../models/qrCode');

// Crear un nuevo invitado
const createGuest = async (req, res) => {
  try {
    const { name, guestId, qrId } = req.body;

    // Verificar si el código QR existe
    const qrExists = await QRCode.findById(qrId);
    if (!qrExists) {
      return res.status(400).json({ message: 'QR code not found' });
    }

    // Verificar si el ID de invitado ya existe
    const guestExists = await Guest.findOne({ guestId });
    if (guestExists) {
      return res.status(400).json({ message: 'Guest ID already exists' });
    }

    const newGuest = new Guest({
      name,
      guestId,
      qrId
    });

    await newGuest.save();

    res.status(201).json({
      message: 'Guest created successfully',
      guest: newGuest
    });
  } catch (error) {
    console.error('Error creating guest:', error);
    res.status(500).json({ message: 'Error creating guest' });
  }
};

// Obtener todos los invitados
const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find().populate('qrId');
    res.status(200).json(guests);
  } catch (error) {
    console.error('Error getting guests:', error);
    res.status(500).json({ message: 'Error getting guests' });
  }
};

// Obtener un invitado por ID
const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id).populate('qrId');
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    res.status(200).json(guest);
  } catch (error) {
    console.error('Error getting guest:', error);
    res.status(500).json({ message: 'Error getting guest' });
  }
};

// Actualizar un invitado
const updateGuest = async (req, res) => {
  try {
    const { name, accessAllowed } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (accessAllowed !== undefined) updateData.accessAllowed = accessAllowed;
    
    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('qrId');
    
    if (!updatedGuest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    res.status(200).json({
      message: 'Guest updated successfully',
      guest: updatedGuest
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({ message: 'Error updating guest' });
  }
};

// Registrar uso de invitación
const registerGuestUse = async (req, res) => {
  try {
    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.id,
      { useDate: new Date() },
      { new: true }
    ).populate('qrId');
    
    if (!updatedGuest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    res.status(200).json({
      message: 'Guest use registered successfully',
      guest: updatedGuest
    });
  } catch (error) {
    console.error('Error registering guest use:', error);
    res.status(500).json({ message: 'Error registering guest use' });
  }
};

module.exports = {
  createGuest,
  getAllGuests,
  getGuestById,
  updateGuest,
  registerGuestUse
};