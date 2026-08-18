import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { transaction_id, user_email, lots, amount, screenshot_base64 } = req.body;

  // 🔥 VERCEL FIX: Yahan bhi Port 465 aur Secure true lagana zaroori hai!
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
    // Base64 image ko process karna attachment ke liye
    let attachments = [];
    if (screenshot_base64) {
      const base64Data = screenshot_base64.split(';base64,').pop();
      attachments.push({
        filename: `payment_screenshot_${transaction_id}.png`,
        content: base64Data,
        encoding: 'base64'
      });
    }

    // Host header nikalna approval link ke liye
    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const approveLink = `${protocol}://${host}/api/approve-order?id=${transaction_id}&email=${user_email}`;

    await transporter.sendMail({
      from: '"SOLARGROUP System" <delivery.solargroup.pro@gmail.com>',
      to: 'krishnapathak20305@gmail.com, skyworldcommunityinfo@gmail.com',
      subject: `🚨 NEW PAYMENT ALERT: $${amount} from ${user_email}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #040d24; color: #ffffff; padding: 30px; border-radius: 15px;">
          <h2 style="color: #00e6b8;">New Investment Verification Request</h2>
          <p><b>User Email:</b> ${user_email}</p>
          <p><b>Transaction ID:</b> ${transaction_id}</p>
          <p><b>Lots Purchased:</b> ${lots}</p>
          <p><b>Total Amount:</b> $${amount}</p>
          <br>
          <p>Please check the attached payment screenshot. If the payment is valid, click the button below to approve.</p>
          <br>
          <a href="${approveLink}" style="background: #00e6b8; color: #040d24; padding: 15px 25px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 10px; display: inline-block;">✅ Approve Transaction</a>
        </div>
      `,
      attachments: attachments
    });

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error("Payment Email Error:", error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}