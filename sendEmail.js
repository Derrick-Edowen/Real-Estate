const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // your Outlook email address
    pass: process.env.EMAIL_PASS, // your Outlook email password
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false // Add this if you're having TLS issues
  }
});


const sendEmail = (formData) => {
  const mailOptions = {
    from: 'oneestatewebservices@outlook.com',
    to: 'oneestatewebservices@outlook.com',
    subject: `New Message from ${formData.firstName}`,
    html: `
      <h4>New Inquiry - Message from ${formData.firstName}</h4>
      <p><strong>Name:</strong> ${formData.firstName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
      <h4><strong>Message:</strong></h4>
      <p>${formData.message}</p>


      <p><small>Powered by One Estate Web Services</small></p>
      <p><small>NO REPLY: Do not reply to this email</small></p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;
