const nodemailer = require("nodemailer");

/**
 * Send an email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body as HTML
 * @param {string} [options.from] - Sender email address (falls back to environment variable)
 * @returns {Promise<Object>} - Nodemailer response
 */
const sendEmail = async ({ to, subject, html, from }) => {
  try {
    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: from || process.env.EMAIL_FROM || "noreply@blogapp.com",
      to,
      subject,
      html,
    });

    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * For development environments - logs email content instead of sending
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body as HTML
 * @param {string} [options.from] - Sender email address
 * @param {Object} [devInfo] - Additional development information to log
 * @returns {Object} - Mock response with development info
 */
const logEmailInDevelopment = ({ to, subject, html, from }, devInfo = {}) => {
  console.log("\n--- DEVELOPMENT MODE: Email Would Be Sent ---");
  console.log(
    `From: ${from || process.env.EMAIL_FROM || "noreply@blogapp.com"}`
  );
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("HTML Content:", html);

  if (Object.keys(devInfo).length > 0) {
    console.log("Development Info:", devInfo);
  }

  console.log("--------------------------------\n");

  return {
    messageId: `dev-${Date.now()}`,
    devMode: true,
    ...devInfo,
  };
};

module.exports = { sendEmail, logEmailInDevelopment };
