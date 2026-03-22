import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #0f172a; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #b45309, #d97706); padding: 40px 32px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px; }
    .body { padding: 36px 32px; color: #cbd5e1; font-size: 15px; line-height: 1.7; }
    .body h2 { color: #f1f5f9; font-size: 20px; margin-bottom: 8px; }
    .highlight { background: #0f172a; border-left: 4px solid #d97706; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
    .highlight p { margin: 6px 0; font-size: 14px; }
    .highlight .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .highlight .value { color: #f1f5f9; font-weight: 700; font-size: 16px; }
    .steps { list-style: none; padding: 0; margin: 24px 0; }
    .steps li { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
    .steps .num { background: #d97706; color: #1e293b; font-weight: 800; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 13px; }
    .steps .text { color: #cbd5e1; font-size: 14px; padding-top: 4px; }
    .cta { text-align: center; margin: 32px 0 0; }
    .cta a { background: linear-gradient(135deg, #b45309, #d97706); color: #fff; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; display: inline-block; }
    .footer { background: #0f172a; padding: 24px 32px; text-align: center; color: #475569; font-size: 13px; }
    .footer a { color: #d97706; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🏆 Welcome to Goldbackbond</h1>
      <p>Your AI Sales Coaching Journey Begins Now</p>
    </div>
    <div class="body">
      <p>Hi <strong>Sydney</strong>,</p>
      <p>Congratulations and welcome to the Goldbackbond Sales Agency team! We're excited to schedule your <strong>first coaching session</strong> with our AI-powered Sales Mentorship system.</p>

      <div class="highlight">
        <p class="label">Session Details</p>
        <p class="value">Session 1 — Onboarding & Baseline Assessment</p>
        <p style="margin-top: 12px;" class="label">Date & Time</p>
        <p class="value">To be confirmed — Reply to this email with your preferred slot</p>
        <p style="margin-top: 12px;" class="label">Format</p>
        <p class="value">AI Sales Mentorship Hub + Phone Debrief</p>
      </div>

      <h2>What to Expect in Session 1</h2>
      <ul class="steps">
        <li><span class="num">1</span><span class="text"><strong>Baseline Knowledge Assessment</strong> — Your AI Coach will evaluate your understanding of the $25M Private Offer, USDGB mechanics, and compliance rules.</span></li>
        <li><span class="num">2</span><span class="text"><strong>AI Sales Simulator Roleplay</strong> — You'll go 1-on-1 with "Mr. Skeptical Buyer," a ruthless HNW investor, coached by Cardone & Hormozi frameworks.</span></li>
        <li><span class="num">3</span><span class="text"><strong>Lifestyle Goal Setting</strong> — Your coach will use your personal goals as fuel for your daily motivation during sessions.</span></li>
        <li><span class="num">4</span><span class="text"><strong>Custom Study Plan</strong> — Based on your weak areas, the AI will assign targeted modules to master before the next session.</span></li>
      </ul>

      <p>Please complete <strong>Modules 1–3</strong> of the training platform before your session so we can jump right into the advanced roleplay.</p>

      <div class="cta">
        <a href="https://bmegacoach.github.io/goldbackbond-training/?module=module-7">Access AI Sales Coach — Module 7 →</a>
      </div>

      <p style="margin-top: 32px;">If you need to propose a different time, simply reply to this email. Looking forward to working with you!</p>
      <p><strong>— The Goldbackbond Coaching Team</strong></p>
    </div>
    <div class="footer">
      <p>Goldbackbond Sales Agency · <a href="https://agency.goldbackbond.com">agency.goldbackbond.com</a></p>
      <p style="margin-top: 4px;">This email was sent from the AI Coach scheduling system. Reply to respond directly.</p>
    </div>
  </div>
</body>
</html>
`;

async function send() {
    try {
        const info = await transporter.sendMail({
            from: '"Goldbackbond AI Coach" <bmegacoach2@gmail.com>',
            to: 'sydney@goldbackbond.com, bmegacoach2@gmail.com, bmegacoach1@gmail.com, Scsuk03@gmail.com',
            subject: '🏆 Your First AI Sales Coaching Session — Welcome, Sydney!',
            html,
            text: `Hi Sydney, Welcome to Goldbackbond! Your first coaching session (Onboarding & Baseline Assessment) is ready to be scheduled. Please reply with your preferred time. In the meantime, complete Modules 1-3 at agency.goldbackbond.com. — The Goldbackbond Coaching Team`,
        });
        console.log('✅ Email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('   Recipients: sydney@goldbackbond.com, bmegacoach2@gmail.com');
    } catch (err) {
        console.error('❌ Failed to send email:', err.message);
        if (err.message.includes('Invalid login') || err.message.includes('Username and Password')) {
            console.error('\n⚠️  Gmail Authentication failed.');
            console.error('   Google now requires an App Password for SMTP when 2FA is enabled.');
            console.error('   Generate one at: https://myaccount.google.com/apppasswords');
            console.error('   Then update GMAIL_APP_PASSWORD in tmp_training_audit/.env\n');
        }
    }
}

send();
