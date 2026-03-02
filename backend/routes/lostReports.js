const express = require('express');
const router = express.Router();
const LostReport = require('../models/LostReport');
const FoundItem = require('../models/FoundItem');
const { protect } = require('../middleware/auth');

// @route   POST /api/lost-reports
// @desc    Submit a new lost document report
// @access  Protected
router.post('/', protect, async (req, res) => {
  const { docType, docNumber, ownerName, lostDate, lostLocation, description } = req.body;

  if (!docType || !docNumber || !ownerName || !lostDate || !lostLocation) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    const report = await LostReport.create({
      reportedBy: req.user._id,
      docType,
      docNumber: docNumber.trim(),
      ownerName,
      lostDate,
      lostLocation,
      description,
    });

    // Auto-check if there's already a matching found item
    const match = await FoundItem.findOne({ docNumber: docNumber.trim() });
    if (match) {
      report.status = 'Matched';
      await report.save();
    }

    res.status(201).json({ report, matchFound: !!match, matchedItem: match || null });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit report.', error: err.message });
  }
});

// @route   GET /api/lost-reports/my
// @desc    Get all reports by logged-in user
// @access  Protected
router.get('/my', protect, async (req, res) => {
  try {
    const reports = await LostReport.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });

    // Attach matched found item for each report
    const enriched = await Promise.all(
      reports.map(async (r) => {
        const match = await FoundItem.findOne({ docNumber: r.docNumber });
        return { ...r.toObject(), matchedItem: match || null };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports.', error: err.message });
  }
});

module.exports = router;
