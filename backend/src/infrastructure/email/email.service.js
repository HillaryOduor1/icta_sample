import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  // Removed insecure rejectUnauthorized: false
});

export const emailService = {
  async sendRaw(to, subject, html, from = config.email.from) {
    await transporter.sendMail({ from, to, subject, html });
  },

  async sendContactNotification(toEmail, tenantName, formData) {
    const subject = `New contact message from ${tenantName}`;
    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Tenant:</strong> ${tenantName}</p>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message.replace(/\n/g, '<br>')}</p>
    `;
    await this.sendRaw(toEmail, subject, html);
  },

  async sendAutoReply(userEmail, userName, tenantName, userMessage) {
    const subject = `Thank you for contacting ${tenantName}`;
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${userName},</h2>
        <p>Thank you for reaching out to <strong>${tenantName}</strong>. We will get back to you soon.</p>
        <p>Your message:</p>
        <blockquote>${userMessage.replace(/\n/g, '<br>')}</blockquote>
        <p>Best regards,<br>${tenantName} Team</p>
      </div>
    `;
    await this.sendRaw(userEmail, subject, html);
  },
};