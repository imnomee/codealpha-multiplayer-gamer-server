import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User({ username, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, {
            httpOnly: true, // Makes the cookie accessible only by the server
            maxAge: 36000000,
        });
        return res.status(201).json({
            token,
            username,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid User' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.cookie('token', token, {
            httpOnly: true, // Makes the cookie accessible only by the server
        });
        return res.status(200).json({ token, username });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', errors });
    }
});

export default router;
