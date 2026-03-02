const mongoose = require('mongoose');

const lostReportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  lostDate: { type: String, required: true },
  lostLocation: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Open', 'Matched', 'Closed'],
    default: 'Open',
  },
}, { timestamps: true });

module.exports = mongoose.model('LostReport', lostReportSchema);
