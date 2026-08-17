import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { transaction_id, user_email, lots, amount, screenshot_base64 } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'delivery.solargroup.pro@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: '"SOLARGROUP Payments" <delivery.solargroup.pro@gmail.com>',
      to: 'krishnapathak20305@gmail.com, skyworldcommunityinfo@gmail.com',
      subject: `New Payment Alert - ID: ${transaction_id}`,
      html: `
        <h2>New Lot Purchase Request</h2>
        <p><b>User Email:</b> ${user_email}</p>
        <p><b>Lots:</b> ${lots}</p>
        <p><b>Total Amount:</b> $${amount}</p>
        <p><b>Transaction ID:</b> ${transaction_id}</p>
        <br>
        <p><a href="https://${req.headers.host}/api/approve-order?id=${transaction_id}&email=${user_email}" style="background: #00e6b8; color: #040d24; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Click Here to Approve Order</a></p>
        <br><br>
        <p>Please check your dashboard to approve or reject this order.</p>
      `,
      attachments: screenshot_base64 ? [
        {
          filename: 'payment_screenshot.png',
          path: screenshot_base64
        }
      ] : []
    });

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}