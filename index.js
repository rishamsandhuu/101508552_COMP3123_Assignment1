const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./model/user.js');

const app = express();
app.use(cors());
app.use(express.json());

// Sign-up route
app.post('/user/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/user/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: "Username/email and password are required" });
        }

        const user = await User.findOne({
            $or: [
                { username: new RegExp(`^${usernameOrEmail}$`, 'i') },
                { email: new RegExp(`^${usernameOrEmail}$`, 'i') }
            ]
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatched = await user.comparePassword(password);
        if (!isMatched) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
