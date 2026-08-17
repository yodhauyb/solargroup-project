import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  // Pehle wala original SMTP transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: 'delivery.solargroup.pro@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: '"SOLARGROUP" <delivery.solargroup.pro@gmail.com>',
      to: email,
      subject: 'Your Verification OTP',
      text: `Your OTP code is: ${otp}`,
      html: `<h3>Your Verification OTP is: <b>${otp}</b></h3>`
    });

    return res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}