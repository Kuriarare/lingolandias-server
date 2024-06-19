const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Step 2: Configure Nodemailer
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/contact', (req, res) => {
  console.log(req.body);

  // Step 3: Send an email with the form data
  let mailOptions = {
    from: 'req.body.email', // sender address
    to: 'agata@lingolandias.net', // list of receivers
    subject: 'Lingolandias Form Submission', // Subject line
    text: `Name: ${req.body.name}\nNumber: ${req.body.number}\nEmail: ${req.body.email}\nMessage: ${req.body.message}` // plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.json({ success: false, error: error.toString() });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ success: true });
    }
  });
});

module.exports = app;