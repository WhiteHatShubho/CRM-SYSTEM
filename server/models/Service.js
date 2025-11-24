const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    serviceType: {
      type: String,
      required: true,
    },
    serviceDate: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    description: String,
    notes: String,
    otpVerification: {
      type: Boolean,
      default: false,
    },
    otp: String,
    amount: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
