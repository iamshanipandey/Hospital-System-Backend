const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    qualifications: [{
      degree: String,
      institution: String,
      year: Number,
    }],
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: {
          type: Boolean,
          default: true,
        },
      }],
    }],
    languages: [{
      type: String,
      trim: true,
    }],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'on-leave', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster searches
doctorSchema.index({ specialization: 1, department: 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor; 