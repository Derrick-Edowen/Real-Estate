const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
