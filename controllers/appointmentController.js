const Appointment = require('../models/Appointment');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({
            patient: req.user._id,
            doctor: req.body.doctor,
            date: req.body.date,
            timeSlot: req.body.timeSlot,
            type: req.body.type,
            reason: req.body.reason,
            fee: req.body.fee
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('patient', 'name email')
            .populate('doctor', 'name email');
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name email')
            .sort('-date');
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor-appointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name email')
            .sort('-date');
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email')
            .populate('doctor', 'name email');

        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            appointment.status = req.body.status || appointment.status;
            appointment.notes = req.body.notes || appointment.notes;
            appointment.symptoms = req.body.symptoms || appointment.symptoms;
            appointment.diagnosis = req.body.diagnosis || appointment.diagnosis;
            appointment.prescription = req.body.prescription || appointment.prescription;
            appointment.paymentStatus = req.body.paymentStatus || appointment.paymentStatus;

            const updatedAppointment = await appointment.save();
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            await appointment.remove();
            res.json({ message: 'Appointment removed' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getMyAppointments,
    getDoctorAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
}; 