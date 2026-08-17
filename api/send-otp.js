import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: 'b5ceff7001@smtp-brevo.com',
      pass: 'xsmtpsib-f1d52f1ffefa299f1e7a9b0f6b7b0c03fa9eed81eddc17e370b00be90a42ee39-TxEGn84NMxqcJMcP'
    }
  });

  try {
    await transporter.sendMail({
      from: '"SOLARGROUP" <info@solargroup.pro>',
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