const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    instructions: {
        type: String
    }
});

const prescriptionSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    medications: [medicationSchema],
    diagnosis: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    issuedDate: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
prescriptionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Prescription', prescriptionSchema); 