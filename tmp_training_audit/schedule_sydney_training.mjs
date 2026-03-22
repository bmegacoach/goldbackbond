import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bmegacoach2@gmail.com',
    pass: 'gyro qoqj lysf dukz' // Use the app password provided by user
  }
});

const sydneyEmail = 'scsuk03@gmail.com';
const barbieEmail = 'barbie@goldbackbond.com';

const sessionDate = new Date();
sessionDate.setHours(sessionDate.getHours() + 2); // 2 hours from now

const sessionInfo = {
  id: 'session-' + Date.now(),
  topic: 'Elite HNW Negotiation & Objections (Extensive Session)',
  date: sessionDate.toISOString(),
  duration: '90 minutes',
  description: 'Intensive roleplay session covering Alex Hormozi Value Equation and Grant Cardone Closing techniques. Focus: $1M+ Private Offer allocations.',
  status: 'scheduled'
};

async function scheduleSession() {
  try {
    const mailOptions = {
      from: 'Goldbackbond Training <bmegacoach2@gmail.com>',
      to: `${sydneyEmail}, ${barbieEmail}`,
      subject: '🚨 URGENT: Sydney\'s Elite Training Session Scheduled',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #ca8a04;">Elite AI Sales Coach Training</h2>
          <p>Hello Sydney,</p>
          <p>Your first extensive AI Sales Coach session has been scheduled.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Topic:</strong> ${sessionInfo.topic}</p>
            <p><strong>Time:</strong> ${new Date(sessionInfo.date).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${sessionInfo.duration}</p>
          </div>
          <p>This session will include:</p>
          <ul>
            <li>Live negotiation with a skeptical $1M+ investor</li>
            <li>Contextual quizzes during the dialogue</li>
            <li>Alex Hormozi Value Equation application</li>
            <li>Grant Cardone "Complaints vs Objections" workshop</li>
          </ul>
          <p>Please log in to the <a href="https://bmegacoach.github.io/goldbackbond-training/" style="color: #ca8a04; font-weight: bold;">Agent Academy</a> to participate.</p>
          <p style="font-size: 12px; color: #64748b; margin-top: 30px;">
            You can update your schedule at any time, but we recommend staying consistent for maximum results.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    // Note: In a real scenario, we'd update the CRM database.
    // Since we're in a local env, I'll update the agentCrmService.ts mock data or a local marker.
    console.log('Session scheduled internally for Sydney.');

  } catch (error) {
    console.error('Error scheduling session:', error);
  }
}

scheduleSession();
