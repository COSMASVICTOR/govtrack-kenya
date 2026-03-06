const sendEmail = require('../utils/sendEmail');
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

    // Send confirmation email
sendEmail({
  to: req.user.email,
  subject: '🔴 Lost Document Report Received - GovTrack Kenya',
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0a5c36;padding:24px;border-radius:12px 12px 0 0">
        <h2 style="color:white;margin:0">GovTrack Kenya</h2>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0">Document Tracking System</p>
      </div>
      <div style="background:#f9fafb;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
        <h3 style="color:#111827">Dear ${req.user.name},</h3>
        <p style="color:#374151">Your lost document report has been <strong>successfully submitted</strong>.</p>
        <div style="background:white;border-radius:10px;padding:20px;margin:20px 0;border:1px solid #e5e7eb">
          <p style="margin:0 0 8px"><strong>Document Type:</strong> ${report.docType}</p>
          <p style="margin:0 0 8px"><strong>Document Number:</strong> ${report.docNumber}</p>
          <p style="margin:0 0 8px"><strong>Lost Location:</strong> ${report.lostLocation}</p>
          <p style="margin:0"><strong>Date Lost:</strong> ${report.lostDate}</p>
        </div>
        <p style="color:#374151">We will <strong>automatically notify you</strong> if a matching found item is reported in our system.</p>
        <a href="https://govtrack-kenya.vercel.app" style="display:inline-block;background:#0a5c36;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">View My Reports</a>
        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
        <p style="color:#9ca3af;font-size:12px">GovTrack Kenya · Machakos County · Kenya Digital Government Initiative 2026</p>
      </div>
    </div>
  `,
});
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
