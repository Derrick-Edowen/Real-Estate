const express = require('express');
const app = express();
const PORT = 3000;

const simpleParser = require('mailparser').simpleParser;
const { fetch } = require('imap-simple');
const nodemailer = require('nodemailer');

const config = {
  imap: {
    user: 'your-email@example.com',
    password: 'your-password',
    host: 'outlook.office365.com', // Outlook IMAP server
    port: 993,
    tls: true,
  },
};

// For Yahoo, use the following config
// const config = {
//   imap: {
//     user: 'your-email@example.com',
//     password: 'your-password',
//     host: 'imap.mail.yahoo.com', // Yahoo IMAP server
//     port: 993,
//     tls: true,
//   },
// };

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password',
  },
});

app.get('/', (req, res) => {
  res.send('Blog Update Server');
});

fetch(config).then(async (connection) => {
  await connection.openBox('INBOX');

  connection.on('mail', async (numNewMsgs) => {
    const messages = await connection.search(['UNSEEN']);
    messages.forEach(async (message) => {
      const parsed = await simpleParser(message.parts[0].body);
      const content = parsed.text;

      // Here you can update your blog content with the received email content
      console.log('Received email content:', content);

      // Send a confirmation email
      const mailOptions = {
        from: 'your-email@example.com',
        to: message.to.text,
        subject: 'Blog Content Update Confirmation',
        text: 'Your blog content has been updated successfully.',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending confirmation email:', error);
        } else {
          console.log('Confirmation email sent:', info.response);
        }
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
