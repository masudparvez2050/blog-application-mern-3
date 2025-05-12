const { sendEmail } = require("../utils/sendEmail");

/**
 * Handle contact form submissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Store in database if needed
    // const newContact = await Contact.create({ name, email, subject, message });

    // Send email notification (you'll need to implement this)
    await sendEmail({
      to: "masudparvez2050@gmail.com",
      subject: `New Contact Form: ${subject}`,
      html: `New message from ${name} (${email}):\n\n${message}`,
    });

    res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
};
