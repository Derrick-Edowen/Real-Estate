const sendGridMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API key
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (formData) => {
  const msg = {
    to: 'oneestatewebservices@outlook.com',  // Recipient email address
    from: 'oneestatewebservices@outlook.com',         // Sender email address (make sure it is verified in SendGrid)
    subject: `New Message from ${formData.firstName}`,
    html: `
      <h4>New Inquiry - Message from ${formData.firstName}</h4>
      <p><strong>Name:</strong> ${formData.firstName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
      <h4><strong>Message:</strong></h4>
      <p>${formData.message}</p>

      <p><small>Powered by One Estate Web Services</small></p>
      <p><small>*NO REPLY: Do not reply directly to this email</small></p>
    `,
  };

  try {
    await sendGridMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;

