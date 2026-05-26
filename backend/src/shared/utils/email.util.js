import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';

// Create transporter with secure TLS (rejectUnauthorized only disabled in development)
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  tls: {
    // Never disable in production
    rejectUnauthorized: config.env !== 'development',
  },
});

/**
 * Send a generic email
 */
export const sendEmail = async ({ to, subject, html, from = config.email.from }) => {
  await transporter.sendMail({ from, to, subject, html });
};

/**
 * Send contact notification to tenant admin
 */
export const sendContactNotification = async (toEmail, tenantName, formData) => {
  const subject = `New contact message from ${tenantName}`;
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Tenant:</strong> ${tenantName}</p>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Message:</strong></p>
    <p>${formData.message.replace(/\n/g, '<br>')}</p>
  `;
  await sendEmail({ to: toEmail, subject, html });
};

/**
 * Send auto‑reply to the user who submitted the contact form
 */
export const sendAutoReply = async (userEmail, userName, tenantName, userMessage) => {
  const subject = `Thank you for contacting ${tenantName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${userName},</h2>
      <p>Thank you for reaching out to <strong>${tenantName}</strong>. We have received your message and will get back to you as soon as possible.</p>
      <p>Here is a copy of your message:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0;">
        ${userMessage.replace(/\n/g, '<br>')}
      </div>
      <p>If you have any urgent matters, please feel free to call us directly.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>${tenantName} Team</strong></p>
    </div>
  `;
  await sendEmail({ to: userEmail, subject, html });
};
/*last stable
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false   // ✅ Allow self-signed certificates (dev only)
  }
});

async function sendContactNotification(toEmail, tenantName, formData) {
  const subject = `New contact message from ${tenantName}`;
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Tenant:</strong> ${tenantName}</p>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Message:</strong></p>
    <p>${formData.message.replace(/\n/g, '<br>')}</p>
  `;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject,
    html
  });
}

module.exports = { sendContactNotification };

// Better: create a function that accepts the message text
async function sendAutoReply(userEmail, userName, tenantName, userMessage) {
  const subject = `Thank you for contacting ${tenantName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${userName},</h2>
      <p>Thank you for reaching out to <strong>${tenantName}</strong>. We have received your message and will get back to you as soon as possible.</p>
      <p>Here is a copy of your message:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0;">
        ${userMessage.replace(/\n/g, '<br>')}
      </div>
      <p>If you have any urgent matters, please feel free to call us directly.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>${tenantName} Team</strong></p>
    </div>
  `;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject,
    html
  });
}

module.exports = { sendContactNotification, sendAutoReply };*/