const mongoose = require('mongoose');

const timelineStepSchema = new mongoose.Schema({
  step: String,
  date: { type: String, default: null },
  done: { type: Boolean, default: false },
}, { _id: false });

const documentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['National ID', 'Passport', 'Driving License', 'KRA PIN Certificate'],
    required: true,
  },
  docNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Processing', 'Ready for Collection', 'Collected'],
    default: 'Processing',
  },
  appliedDate: { type: String, required: true },
  updatedDate: { type: String, required: true },
  office: { type: String, required: true },
  isLost: { type: Boolean, default: false },
  timeline: [timelineStepSchema],
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
