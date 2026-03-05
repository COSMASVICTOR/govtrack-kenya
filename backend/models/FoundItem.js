const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  docType: {
    type: String,
    enum: ['National ID', 'Passport', 'Driving License', 'KRA PIN Certificate'],
    required: true,
  },
  docNumber: {
    type: String,
    required: true,
    trim: true,
  },
  ownerName: { type: String, required: true },
  foundDate: { type: String, required: true },
  foundLocation: { type: String, required: true },
  foundBy: { type: String, required: true },
  depositedAt: { type: String, required: true },
  status: {
    type: String,
    enum: ['Awaiting Owner', 'Collected', 'Transferred to Police', 'Transferred to Huduma', 'Unclaimed - Archived'],
    default: 'Awaiting Owner',
  },
  loggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);
