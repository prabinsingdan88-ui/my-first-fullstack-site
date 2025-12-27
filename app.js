const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to Art Database'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Schema for Art Inquiries
const InquirySchema = new mongoose.Schema({
  artTitle: String,
  customerName: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', InquirySchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to handle "Buy/Inquiry" button clicks
app.post('/inquiry', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.send('<h1>Inquiry Sent!</h1><p>I will contact you soon about the artwork.</p><a href="/">Back to Gallery</a>');
  } catch (err) {
    res.status(500).send('Error sending inquiry');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Art Gallery running on port ${PORT}`));