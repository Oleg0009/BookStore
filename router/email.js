const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Outlook', etc.
  auth: {
    user: 'iom.creators.ua@gmail.com', // your email
    pass: 'wavo dqbd bden rpcv', // your email password
  },
});

router.post('/send-email', (req, res) => {
  const { email, first_name, last_name, message } = req.body;
  // Create email data
  const mailOptions = {
    from: email, // your email
    to: 'iom.creators.ua@gmail.com', // recipient's email
    subject: 'New Email from Your Website',
    text: `
    Name: ${last_name + ' ' + first_name }\n
    Email: ${email}\n
    Message: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});





module.exports = router