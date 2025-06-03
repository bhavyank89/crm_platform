import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

// ===================== SIGNUP =====================
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const success = false;

        if (!email || !password) {
            return res.status(400).json({ success, message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success, message: 'No user found with this email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success, message: 'Incorrect password.' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// ===================== GOOGLE OAUTH =====================

// Start Google OAuth flow
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        session: false,
    }),
    (req, res) => {
        try {
            const user = req.user;
            const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            res.redirect(`${FRONTEND_URL}/login?token=${token}`);
        } catch (err) {
            console.error('OAuth Error:', err);
            res.redirect('/');
        }
    }
);

export default router;
