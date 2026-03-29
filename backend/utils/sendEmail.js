const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  console.log('📧 Attempting to send email to:', to);
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"GovTrack Kenya" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

module.exports = sendEmail;