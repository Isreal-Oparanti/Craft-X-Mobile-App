// services/emailService.js
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code for Craft X',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6A5ACD;">Welcome to Craft X!</h2>
          <p>Thank you for signing up. Please use the verification code below to complete your registration:</p>
          <div style="background-color: #f0f0ff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; color: #6A5ACD;">${code}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Thanks,<br>The Craft X Team</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };