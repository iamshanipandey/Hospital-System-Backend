const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Patient = require('../models/Patient');

// Get all patients
router.get('/', auth, authorize('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('user', '-password')
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Get single patient
router.get('/:id', auth, authorize('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient' });
  }
});

// Create patient
router.post('/', auth, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { userData, user: userId } = req.body;
    
    // Add name directly to the patient document
    if (userData && userData.name) {
      req.body.name = userData.name;
    }
    
    // If userData is provided, update the associated user record
    if (userData && userData.name && userId) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      
      if (user) {
        // Update name if not already set
        if (!user.name) {
          user.name = userData.name;
          await user.save();
          console.log(`Updated user ${userId} with name ${userData.name}`);
        }
      }
    }
    
    const patient = new Patient(req.body);
    await patient.save();
    
    // Populate user data
    const populatedPatient = await Patient.findById(patient._id)
      .populate('user', '-password');
    
    res.status(201).json(populatedPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(400).json({ message: 'Error creating patient', details: error.message });
  }
});

// Update patient
router.put('/:id', auth, authorize('admin', 'staff'), async (req, res) => {
  try {
    // Make sure name is saved directly in the patient document
    if (req.body.userData && req.body.userData.name) {
      req.body.name = req.body.userData.name;
    }
    
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', '-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient' });
  }
});

// Delete patient
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient' });
  }
});

// Search patients
router.get('/search/:query', auth, authorize('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const query = req.params.query;
    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phoneNumber: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error searching patients' });
  }
});

module.exports = router; 