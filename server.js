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

// Configure Nodemailer
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

  // Send an email with the form data
  let mailOptions = {
    from: req.body.email, // sender address
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

app.get('/', (req, res) => {
  res.send('Awake!');
});
app.post('/spanishscore', async (req, res) => {
  const { email, score, totalQuestions } = req.body;

  if (!email || typeof score !== 'number' || typeof totalQuestions !== 'number') {
    return res.status(400).send('Invalid request');
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your Quiz Score',
    text: `Thank you so much for taking the time to complete our quiz. This is just an attempt to help you understand your current level. You scored ${score} out of ${totalQuestions} in the quiz.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

// New endpoint to handle English quiz score
app.post('/englishscore', async (req, res) => {
  const { email, percentage } = req.body;

  if (!email || typeof percentage !== 'string') {
    return res.status(400).send('Invalid request');
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your English Quiz Score',
    text: `Thank you so much for taking the time to complete our English quiz. You answered ${percentage}% of the questions correctly. Keep practicing and improving your skills!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});


module.exports = app;
