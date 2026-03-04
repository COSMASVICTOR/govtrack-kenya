const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Document = require('../models/Document');
const LostReport = require('../models/LostReport');
const FoundItem = require('../models/FoundItem');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route   GET /api/admin/stats
// @desc    Get system-wide statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalDocs, processing, ready, collected, lostReports, foundItems, users] = await Promise.all([
      Document.countDocuments(),
      Document.countDocuments({ status: 'Processing' }),
      Document.countDocuments({ status: 'Ready for Collection' }),
      Document.countDocuments({ status: 'Collected' }),
      LostReport.countDocuments(),
      FoundItem.countDocuments(),
      User.countDocuments({ role: 'citizen' }),
    ]);

    res.json({ totalDocs, processing, ready, collected, lostReports, foundItems, users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get stats.', error: err.message });
  }
});

// @route   GET /api/admin/documents
// @desc    Get all documents with owner info
router.get('/documents', async (req, res) => {
  try {
    const docs = await Document.find().populate('owner', 'name email nationalId').sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents.', error: err.message });
  }
});

// @route   PATCH /api/admin/documents/:id/status
// @desc    Update document status
router.patch('/documents/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Processing', 'Ready for Collection', 'Collected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status, updatedDate: new Date().toISOString().slice(0, 10) },
      { new: true }
    ).populate('owner', 'name email');

    if (!doc) return res.status(404).json({ message: 'Document not found.' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.', error: err.message });
  }
});

// @route   GET /api/admin/lost-reports
// @desc    Get all lost reports
router.get('/lost-reports', async (req, res) => {
  try {
    const reports = await LostReport.find()
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 });

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

// @route   GET /api/admin/found-items
// @desc    Get all found items
router.get('/found-items', async (req, res) => {
  try {
    const items = await FoundItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch found items.', error: err.message });
  }
});

// @route   POST /api/admin/found-items
// @desc    Log a newly recovered document
router.post('/found-items', async (req, res) => {
  const { docType, docNumber, ownerName, foundDate, foundLocation, foundBy, depositedAt } = req.body;

  if (!docType || !docNumber || !ownerName || !foundDate || !foundLocation || !foundBy || !depositedAt) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const item = await FoundItem.create({
      docType, docNumber: docNumber.trim(), ownerName,
      foundDate, foundLocation, foundBy, depositedAt,
      loggedBy: req.user._id,
    });

    // Auto-update matching lost reports
    await LostReport.updateMany(
      { docNumber: docNumber.trim(), status: 'Open' },
      { status: 'Matched' }
    );

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to log found item.', error: err.message });
  }
});

// @route   PATCH /api/admin/found-items/:id/status
// @desc    Update found item status
router.patch('/found-items/:id/status', async (req, res) => {
  try {
    const item = await FoundItem.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item.', error: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'citizen' }).sort({ createdAt: -1 });
    const enriched = await Promise.all(
      users.map(async (u) => {
        const docCount = await Document.countDocuments({ owner: u._id });
        return { ...u.toObject(), docCount };
      })
    );
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.', error: err.message });
  }
});
// @route GET /api/admin/lost-reports
router.get('/lost-reports', protect, adminOnly, async (req, res) => {
  try {
    const reports = await LostReport.find().populate('reportedBy', 'name phone email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/admin/found-items
router.get('/found-items', protect, adminOnly, async (req, res) => {
  try {
    const items = await FoundItem.find().populate('loggedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
