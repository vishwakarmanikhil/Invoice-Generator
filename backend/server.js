const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

// Increase payload size limit (e.g., 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Start the server on port 8080
const PORT = process.env.PORT || 8080;

// Allow requests from specific origins
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
}));

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/createFile/:number', (req, res) => {
    const { number } = req.params;
    const jsonData = req.body;
  
    const directoryPath = path.join(__dirname, 'data');
    const filename = `data${number}.json`;
    const filePath = path.join(directoryPath, filename);
  
    try {
      fs.writeFileSync(filePath, JSON.stringify(jsonData));
      res.status(200).send(`File ${filename} created successfully`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating file');
    }
});

// get created file
app.get('/getFile/:number', (req, res) => {
    const { number } = req.params;
  
    const directoryPath = path.join(__dirname, 'data'); // directory path
    const filename = `data${number}.json`;
    const filePath = path.join(directoryPath, filename);
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(200).send('File not found');
        return;
      }
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    });
});

// send email
app.post('/sendEmail', async (req, res) => {

  //FormData fields
  const recipientEmail = req.body.recipientEmail;
  const subject = req.body.subject;
  const bodyText = req.body.bodyText;
  const pdfUrl = req.body.blobData;
  const fileName = req.body.fileName;

  // Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: 'menikhilv143@gmail.com',
        pass: '5yq3cXaF24jRGS0m'
    }
  });

  // Email content and attachment
  const mailOptions = {
    from: 'Invoice Generator <menikhilv143@gmail.com>',
    to: recipientEmail,
    subject: subject,
    text: bodyText,
    attachments: [
      {
        filename: fileName,
        path: pdfUrl,
      },
    ],
  };

  try {

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});