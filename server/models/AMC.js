const mongoose = require('mongoose');

const amcSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amcName: {
      type: String,
      required: [true, 'Please provide AMC name'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide end date'],
    },
    renewalDate: {
      type: Date,
    },
    nextServiceDate: {
      type: Date,
    },
    serviceFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'half-yearly', 'yearly'],
      default: 'quarterly',
    },
    amcValue: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDue: {
      type: Boolean,
      default: false,
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AMC', amcSchema);
