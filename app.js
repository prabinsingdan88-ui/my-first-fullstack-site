require('dotenv').config(); // Load secret variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Use the port the hosting service gives us, or 3000 locally
const PORT = process.env.PORT || 3000;

// Import the Message model
const Message = require('./models/Message');

// 1. DATABASE CONNECTION
// We use process.env.DATABASE_URL for safety once online
const dbURI = process.env.DATABASE_URL || 'mongodb+srv://prabinsingdan88_db_user:anmhGFv6vMynz9Wi@cluster0.avg7bfp.mongodb.net/?appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB Cloud!'))
    .catch((err) => console.log('Database connection error:', err));

// 2. MIDDLEWARE
app.use(express.static('public'));
app.use(express.json()); 

// 3. ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// CREATE: Save a new message
app.post('/send-message', async (req, res) => {
    try {
        const newMessage = new Message({
            name: req.body.name,
            content: req.body.content
        });
        await newMessage.save();
        res.status(200).json({ message: 'Success! Data saved.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// READ: Get all messages
app.get('/get-messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// DELETE: Remove a message
app.delete('/delete-message/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});