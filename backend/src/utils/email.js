const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    throw error;
  }
};

const emailTemplates = {
  welcome: (name, verifyUrl) => ({
    subject: '🛍️ Welcome to Bag Express!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;border-radius:10px;">
        <div style="background:#1a1a2e;padding:20px;border-radius:8px;text-align:center;">
          <h1 style="color:#e94560;margin:0;">BAG EXPRESS</h1>
        </div>
        <div style="padding:30px;background:white;margin-top:10px;border-radius:8px;">
          <h2>Welcome, ${name}! 🎉</h2>
          <p>Thank you for joining Bag Express. Please verify your email to get started.</p>
          <a href="${verifyUrl}" style="display:inline-block;background:#e94560;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;margin-top:15px;">Verify Email</a>
          <p style="color:#999;font-size:12px;margin-top:20px;">This link expires in 24 hours.</p>
        </div>
      </div>
    `,
  }),

  resetPassword: (name, resetUrl) => ({
    subject: '🔐 Reset Your Bag Express Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;border-radius:10px;">
        <div style="background:#1a1a2e;padding:20px;border-radius:8px;text-align:center;">
          <h1 style="color:#e94560;margin:0;">BAG EXPRESS</h1>
        </div>
        <div style="padding:30px;background:white;margin-top:10px;border-radius:8px;">
          <h2>Password Reset Request</h2>
          <p>Hi ${name}, click below to reset your password. This link expires in 10 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#e94560;color:white;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;margin-top:15px;">Reset Password</a>
          <p style="color:#999;font-size:12px;margin-top:20px;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  }),

  orderConfirmation: (name, order) => ({
    subject: `✅ Order Confirmed #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;border-radius:10px;">
        <div style="background:#1a1a2e;padding:20px;border-radius:8px;text-align:center;">
          <h1 style="color:#e94560;margin:0;">BAG EXPRESS</h1>
        </div>
        <div style="padding:30px;background:white;margin-top:10px;border-radius:8px;">
          <h2>Order Confirmed! 🎉</h2>
          <p>Hi ${name}, your order has been confirmed.</p>
          <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
          <p><strong>Total:</strong> ₹${order.totalPrice}</p>
          <p>We'll notify you when your order ships.</p>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };