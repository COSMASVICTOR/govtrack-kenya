const express = require('express');
const router = express.Router();
const FoundItem = require('../models/FoundItem');
const LostReport = require('../models/LostReport');
const { protect } = require('../middleware/auth');

// @route   GET /api/found-items
// @desc    Get all found items (public searchable registry)
// @access  Protected
router.get('/', protect, async (req, res) => {
  try {
    const { query, docType } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { docNumber: { $regex: query, $options: 'i' } },
        { ownerName: { $regex: query, $options: 'i' } },
      ];
    }
    if (docType && docType !== 'all') {
      filter.docType = docType;
    }

    const items = await FoundItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch found items.', error: err.message });
  }
});

// @route   GET /api/found-items/public
// @desc    Public search (no login required)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { docNumber: { $regex: query, $options: 'i' } },
        { ownerName: { $regex: query, $options: 'i' } },
      ];
    }

    const items = await FoundItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Search failed.', error: err.message });
  }
});
// @route   POST /api/found-items/report
// @desc    Citizen reports a found document
// @access  Protected
router.post('/report', protect, async (req, res) => {
  const { docType, docNumber, ownerName, foundDate, 
          foundLocation, depositedAt } = req.body;

  if (!docType || !docNumber || !ownerName || 
      !foundDate || !foundLocation || !depositedAt) {
    return res.status(400).json({ 
      message: 'All fields are required.' 
    });
  }

  try {
    const item = await FoundItem.create({
      docType,
      docNumber: docNumber.trim(),
      ownerName,
      foundDate,
      foundLocation,
      foundBy: 'Citizen Report',
      depositedAt,
      loggedBy: req.user._id,
    });

    // Auto-match with existing lost reports
    await LostReport.updateMany(
      { docNumber: docNumber.trim(), status: 'Open' },
      { status: 'Matched' }
    );

    const matchCount = await LostReport.countDocuments({ 
      docNumber: docNumber.trim() 
    });

    res.status(201).json({ 
      item, 
      matchFound: matchCount > 0 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to submit report.', 
      error: err.message 
    });
  }
});
module.exports = router;
