const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Outlook', etc.
  auth: {
    user: 'olegstatkevychb@gmail.com', // your email
    pass: 'hnjj hevf gard hblz', // your email password
  },
});

router.post('/send-email', (req, res) => {
  const { email, name, surname, message } = req.body;
  // Create email data
  const mailOptions = {
    from: email, // your email
    to: 'olegstatkevychb@gmail.com', // recipient's email
    subject: 'New Email from Your Website',
    text: `
    Name: ${surname + ' ' + name }\n
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