const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    allergies: [{
        type: String
    }],
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        notes: String,
        medications: [{
            name: String,
            dosage: String,
            frequency: String,
            startDate: Date,
            endDate: Date
        }]
    }],
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
        address: String
    },
    insurance: {
        provider: String,
        policyNumber: String,
        validUntil: Date,
        coverageDetails: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema); 