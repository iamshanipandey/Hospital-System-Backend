const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
    type: {
      type: String,
      enum: ['consultation', 'follow-up', 'emergency', 'routine-checkup'],
      default: 'consultation',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    reason: {
      type: String,
      required: true,
    },
    symptoms: [{
      type: String,
    }],
    diagnosis: {
      type: String,
      trim: true,
    },
    prescription: [{
      medicine: String,
      dosage: String,
      frequency: String,
      duration: String,
      notes: String,
    }],
    notes: {
      type: String,
      trim: true,
    },
    vitals: {
      bloodPressure: String,
      temperature: Number,
      heartRate: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
    },
    followUpDate: Date,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 