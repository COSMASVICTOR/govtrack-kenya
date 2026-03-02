const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

// @route   GET /api/documents/my
// @desc    Get all documents belonging to logged-in user
// @access  Protected
router.get('/my', protect, async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.user._id });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents.', error: err.message });
  }
});

// @route   GET /api/documents/track/:docNumber
// @desc    Track a document by number (public search)
// @access  Protected
router.get('/track/:docNumber', protect, async (req, res) => {
  try {
    const doc = await Document.findOne({
      docNumber: req.params.docNumber.trim(),
    }).populate('owner', 'name email');

    if (!doc) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Search failed.', error: err.message });
  }
});

module.exports = router;
