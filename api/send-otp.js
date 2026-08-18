import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  // 🔥 VERCEL FIX: Use Port 465 & Secure: true (Vercel allows this port instantly)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'delivery.solargroup.pro@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: '"SOLARGROUP" <delivery.solargroup.pro@gmail.com>',
      to: email,
      subject: 'SOLARGROUP - Verification OTP',
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
               <h2>Welcome to SOLARGROUP</h2>
               <p>Your secure verification OTP is:</p>
               <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
             </div>`
    });

    return res.status(200).json({ status: 'success', message: 'OTP sent' });
  } catch (error) {
    console.error("Gmail Delivery Error:", error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}