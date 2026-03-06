const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
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

    // Notify owners of matched lost reports
const matchedReports = await LostReport.find({
  docNumber: docNumber.trim(), status: 'Matched'
}).populate('reportedBy', 'name email');

for (const report of matchedReports) {
  if (report.reportedBy?.email) {
    sendEmail({
      to: report.reportedBy.email,
      subject: '🎉 Your Lost Document Has Been Found! - GovTrack Kenya',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0a5c36;padding:24px;border-radius:12px 12px 0 0">
            <h2 style="color:white;margin:0">GovTrack Kenya</h2>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0">Document Tracking System</p>
          </div>
          <div style="background:#f9fafb;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
            <h3 style="color:#111827">Great news, ${report.reportedBy.name}! 🎉</h3>
            <p style="color:#374151">Your lost document has been <strong>found and reported</strong> in our system!</p>
            <div style="background:#f0fdf4;border-radius:10px;padding:20px;margin:20px 0;border:1px solid #bbf7d0">
              <p style="margin:0 0 8px"><strong>Document Type:</strong> ${report.docType}</p>
              <p style="margin:0 0 8px"><strong>Document Number:</strong> ${report.docNumber}</p>
              <p style="margin:0 0 8px"><strong>Found At:</strong> ${foundLocation}</p>
              <p style="margin:0"><strong>Deposited At:</strong> ${depositedAt}</p>
            </div>
            <p style="color:#374151">Please visit <strong>${depositedAt}</strong> with your National ID to collect your document.</p>
            <a href="https://govtrack-kenya.vercel.app" style="display:inline-block;background:#0a5c36;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">View My Reports</a>
            <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
            <p style="color:#9ca3af;font-size:12px">GovTrack Kenya · Machakos County · Kenya Digital Government Initiative 2026</p>
          </div>
        </div>
      `,
    });
  }
}
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
