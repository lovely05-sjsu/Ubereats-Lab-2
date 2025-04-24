const nodemailer = require('nodemailer');

exports.sendOrderConfirmationEmail = async (req, res) => {
  const { email, orderDetails } = req.body;

  if (!email || !orderDetails) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your email password or app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Confirmation - UberEATS Clone",
    html: `
      <h2>Thank you for your order!</h2>
      <p>Here are your order details:</p>
      <ul>
        ${orderDetails.orderDetails.items.map(item => `
          <li>${item.name} - Quantity: ${item.quantity}, Price: $${item.price}</li>
        `).join('')}
      </ul>
      <p><strong>Total:</strong> $${orderDetails.orderDetails.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
      <p>We hope you enjoy your meal!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Order confirmation email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
