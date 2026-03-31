import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cron from 'node-cron';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bmegacoach2@gmail.com',
    pass: 'gyro qoqj lysf dukz' // Use the app password provided by user
  }
});

const sydneyEmail = 'bmegacoach2@gmail.com';
const troyEmail = 'bmegacoach1@gmail.com';

async function scheduleSession() {
  const sessionDate = new Date();
  sessionDate.setHours(9, 0, 0, 0); // Scheduled for 9 AM today

  const sessionInfo = {
    id: 'session-' + Date.now(),
    topic: 'Daily Planner & AI Sales Training Confirmation',
    date: sessionDate.toISOString(),
    duration: '45 minutes',
    description: 'Daily training and sales alignment session.',
    status: 'scheduled'
  };

  try {
    const mailOptions = {
      from: 'Goldbackbond Training <bmegacoach2@gmail.com>',
      to: `${sydneyEmail}, ${troyEmail}`,
      subject: '📅 Confirmation: Daily Planner & Training Session (9:00 AM)',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #ca8a04;">Daily Planner & Training Confirmation</h2>
          <p>Hello Sydney and Troy,</p>
          <p>This is your automated confirmation for today's daily planner and training session.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Topic:</strong> ${sessionInfo.topic}</p>
            <p><strong>Time:</strong> ${new Date(sessionInfo.date).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${sessionInfo.duration}</p>
          </div>
          <p>Before the session begins, please ensure you have reviewed yesterday's metrics and updated your CRM.</p>
          <p>Log in to the <a href="https://bmegacoach.github.io/goldbackbond-training/" style="color: #ca8a04; font-weight: bold;">Training Portal</a> to prepare.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[${new Date().toISOString()}] Email sent: ` + info.response);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error scheduling session:`, error);
  }
}

// Schedule to run every day at 9:00 AM
console.log('Daily planner cron job started. Will execute every day at 09:00.');
cron.schedule('0 9 * * *', () => {
  console.log('Executing daily planner email job...');
  scheduleSession();
});

// Optional: Also run once immediately on startup to confirm it works
// scheduleSession();

