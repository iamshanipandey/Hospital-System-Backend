const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', auth, authorize('admin', 'staff'), async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Get single doctor
router.get('/:id', auth, authorize('admin', 'staff', 'doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', '-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

// Create doctor
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    console.log('Doctor creation request body:', req.body);
    
    // Check required fields from the model
    const { userId, specialization, experience, department, registrationNumber, consultationFee, userData } = req.body;
    
    // Add name directly to the doctor document
    if (userData && userData.name) {
      req.body.name = userData.name;
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    if (!specialization) {
      return res.status(400).json({ message: 'specialization is required' });
    }
    
    if (!experience) {
      return res.status(400).json({ message: 'experience is required' });
    }
    
    if (!department) {
      return res.status(400).json({ message: 'department is required' });
    }
    
    if (!registrationNumber) {
      return res.status(400).json({ message: 'registrationNumber is required' });
    }
    
    if (!consultationFee) {
      return res.status(400).json({ message: 'consultationFee is required' });
    }
    
    // If userData is provided, update the associated user record
    if (userData && userData.name) {
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
    
    const doctor = new Doctor({
      ...req.body,
      userId: req.body.userId,
    });
    
    await doctor.save();
    
    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('userId', '-password');
    
    res.status(201).json(populatedDoctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    
    // More detailed error messages
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        details: messages.join(', ') 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate key error',
        details: 'A doctor with this registration number already exists'
      });
    }
    
    res.status(400).json({ message: 'Error creating doctor', details: error.message });
  }
});

// Update doctor
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    // Make sure name is saved directly in the doctor document
    if (req.body.userData && req.body.userData.name) {
      req.body.name = req.body.userData.name;
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', '-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating doctor' });
  }
});

// Delete doctor
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor' });
  }
});

// Search doctors by name, specialization, or department
router.get('/search/:query', auth, async (req, res) => {
  try {
    const query = req.params.query;
    const doctors = await Doctor.find({
      $or: [
        { specialization: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } },
      ],
    }).populate('userId', '-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error searching doctors' });
  }
});

// Get doctor's availability
router.get('/:id/availability', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor availability' });
  }
});

module.exports = router; 