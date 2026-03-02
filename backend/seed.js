const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Document = require('./models/Document');
const LostReport = require('./models/LostReport');
const FoundItem = require('./models/FoundItem');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Document.deleteMany(),
    LostReport.deleteMany(),
    FoundItem.deleteMany(),
  ]);
  console.log('🧹 Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);
  const adminPassword = await bcrypt.hash('admin2026', 12);

  const [victor, jane, admin] = await User.insertMany([
    { name: 'Victor Cosmas', email: 'victor@example.com', phone: '0712345678', nationalId: '34567890', password: hashedPassword, role: 'citizen' },
    { name: 'Jane Wanjiku', email: 'jane@example.com', phone: '0723456789', nationalId: '23456789', password: hashedPassword, role: 'citizen' },
    { name: 'Admin Officer', email: 'admin@govtrack.ke', phone: '0700000001', nationalId: '00000001', password: adminPassword, role: 'admin' },
  ]);
  console.log('👤 Created users');

  // Create documents
  await Document.insertMany([
    {
      owner: victor._id, type: 'National ID', docNumber: '34567890',
      status: 'Ready for Collection', appliedDate: '2025-10-15', updatedDate: '2025-11-20',
      office: 'Machakos Huduma Centre', isLost: false,
      timeline: [
        { step: 'Application Submitted', date: '2025-10-15', done: true },
        { step: 'Under Review', date: '2025-10-25', done: true },
        { step: 'Printing', date: '2025-11-10', done: true },
        { step: 'Ready for Collection', date: '2025-11-20', done: true },
        { step: 'Collected', date: null, done: false },
      ],
    },
    {
      owner: victor._id, type: 'Passport', docNumber: 'AK1234567',
      status: 'Processing', appliedDate: '2025-12-01', updatedDate: '2026-01-08',
      office: 'Machakos Immigration Office', isLost: false,
      timeline: [
        { step: 'Application Submitted', date: '2025-12-01', done: true },
        { step: 'Biometrics Captured', date: '2025-12-10', done: true },
        { step: 'Processing', date: '2026-01-08', done: true },
        { step: 'Ready for Collection', date: null, done: false },
        { step: 'Collected', date: null, done: false },
      ],
    },
    {
      owner: victor._id, type: 'Driving License', docNumber: 'DL98765432',
      status: 'Collected', appliedDate: '2025-06-01', updatedDate: '2025-07-15',
      office: 'NTSA Machakos', isLost: false,
      timeline: [
        { step: 'Application Submitted', date: '2025-06-01', done: true },
        { step: 'Driving Test Passed', date: '2025-06-15', done: true },
        { step: 'Printing', date: '2025-07-01', done: true },
        { step: 'Ready for Collection', date: '2025-07-10', done: true },
        { step: 'Collected', date: '2025-07-15', done: true },
      ],
    },
    {
      owner: victor._id, type: 'KRA PIN Certificate', docNumber: 'A012345678X',
      status: 'Ready for Collection', appliedDate: '2026-01-10', updatedDate: '2026-01-12',
      office: 'KRA iTax Portal (Online)', isLost: false,
      timeline: [
        { step: 'Online Application', date: '2026-01-10', done: true },
        { step: 'Verification', date: '2026-01-11', done: true },
        { step: 'PIN Issued', date: '2026-01-12', done: true },
        { step: 'Certificate Downloaded', date: null, done: false },
      ],
    },
    {
      owner: jane._id, type: 'National ID', docNumber: '23456789',
      status: 'Processing', appliedDate: '2026-01-20', updatedDate: '2026-02-01',
      office: 'Machakos Huduma Centre', isLost: true,
      timeline: [
        { step: 'Application Submitted', date: '2026-01-20', done: true },
        { step: 'Under Review', date: '2026-02-01', done: true },
        { step: 'Printing', date: null, done: false },
        { step: 'Ready for Collection', date: null, done: false },
        { step: 'Collected', date: null, done: false },
      ],
    },
  ]);
  console.log('📄 Created documents');

  // Create lost reports
  await LostReport.insertMany([
    { reportedBy: victor._id, docType: 'National ID', docNumber: '34567890', ownerName: 'Victor Cosmas', lostDate: '2025-09-10', lostLocation: 'Machakos Town', description: 'Lost near Machakos Bus Stage', status: 'Matched' },
    { reportedBy: jane._id, docType: 'Driving License', docNumber: 'DL11223344', ownerName: 'Jane Wanjiku', lostDate: '2026-01-05', lostLocation: 'Mlolongo', description: 'Lost during commute', status: 'Matched' },
  ]);
  console.log('🚨 Created lost reports');

  // Create found items
  await FoundItem.insertMany([
    { docType: 'National ID', docNumber: '34567890', ownerName: 'Victor Cosmas', foundDate: '2025-09-12', foundLocation: 'Machakos Bus Stage', foundBy: 'Police Officer', depositedAt: 'Machakos Police Station', status: 'Awaiting Owner', loggedBy: admin._id },
    { docType: 'Driving License', docNumber: 'DL11223344', ownerName: 'Jane Wanjiku', foundDate: '2026-01-07', foundLocation: 'Mlolongo Area', foundBy: 'Good Samaritan', depositedAt: 'Mlolongo Huduma Centre', status: 'Awaiting Owner', loggedBy: admin._id },
    { docType: 'Passport', docNumber: 'BB9876543', ownerName: 'John Mwangi', foundDate: '2026-02-01', foundLocation: 'Nairobi CBD', foundBy: 'Security Guard', depositedAt: 'Central Police Station', status: 'Awaiting Owner', loggedBy: admin._id },
    { docType: 'National ID', docNumber: '45678901', ownerName: 'Mary Mutua', foundDate: '2026-02-10', foundLocation: 'Athi River', foundBy: 'Good Samaritan', depositedAt: 'Athi River Huduma Centre', status: 'Collected', loggedBy: admin._id },
  ]);
  console.log('📥 Created found items');

  console.log('\n✅ Database seeded successfully!');
  console.log('──────────────────────────────────');
  console.log('Citizen login:  victor@example.com / password123');
  console.log('Admin login:    admin@govtrack.ke / admin2026');
  console.log('──────────────────────────────────');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
