import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

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

    // Telegram
    const message = `💬 Contact Form:\n👤 ${name}\n📧 ${
      contact || 'No contact'
    }\n📝 ${comment}`;
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      },
    );

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error.message);
    res.status(500).json({ message: 'Failed to send email.' });
  }
};

export default sendEmail;
