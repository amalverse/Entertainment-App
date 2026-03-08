const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services like SendGrid, Mailgun, etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  // Define email options
  const mailOptions = {
    from: `"Entertainment App" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
