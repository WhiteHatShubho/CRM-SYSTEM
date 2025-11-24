const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Please provide mobile number'],
      unique: true,
      match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number'],
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    isRecurring: {
      type: Boolean,
      default: false,
    },
    serviceCount: {
      type: Number,
      default: 0,
    },
    amcCount: {
      type: Number,
      default: 0,
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
