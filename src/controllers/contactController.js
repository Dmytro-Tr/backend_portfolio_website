const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (req, res) => {
  try {
    const { name, contact, comment } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password!
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: 'New Contact Message from Portfolio',
      text: `Name: ${name}\nContact: ${contact}\nComment: ${comment}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error.message);
    res.status(500).json({ message: 'Failed to send email.' });
  }
};

module.exports = { sendEmail };
