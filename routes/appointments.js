const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');

// Get all appointments
router.get('/', auth, authorize('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'userId',
          select: '-password'
        }
      })
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get single appointment
router.get('/:id', auth, authorize('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'userId',
          select: '-password'
        }
      });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment' });
  }
});

// Create appointment
router.post('/', auth, authorize('admin', 'staff'), async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'userId',
          select: '-password'
        }
      });
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ message: 'Error creating appointment' });
  }
});

// Update appointment
router.put('/:id', auth, authorize('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'userId',
          select: '-password'
        }
      });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating appointment' });
  }
});

// Delete appointment
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment' });
  }
});

// Get appointments by date range
router.get('/range/:startDate/:endDate', auth, authorize('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'userId',
          select: '-password'
        }
      })
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get doctor's appointments
router.get('/doctor/:doctorId', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId
    })
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'userId',
          select: '-password'
        }
      })
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor appointments' });
  }
});

// Get patient's appointments
router.get('/patient/:patientId', auth, authorize('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.params.patientId
    })
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'userId',
          select: '-password'
        }
      })
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient appointments' });
  }
});

module.exports = router; 