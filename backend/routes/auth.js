const express  = require('express');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const User      = require('../models/User');

const router        = express.Router();
const JWT_SECRET    = process.env.JWT_SECRET;
const JWT_EXPIRES   = '7d';
const SALT_ROUNDS   = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, age: user.age },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

const userPayload = (user) => ({
  id:    user._id,
  email: user.email,
  age:   user.age,
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  try {
    const { email, password, age } = req.body;

    if (!email || !password || age === undefined)
      return res.status(400).json({ message: 'Email, password, and age are required.' });

    if (age < 0 || age > 120)
      return res.status(400).json({ message: 'Age must be between 0 and 120.' });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: 'An account with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      email:    email.toLowerCase(),
      password: hashedPassword,
      age:      parseInt(age, 10),
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token:   signToken(user),
      user:    userPayload(user),
    });
  } catch (err) {
    console.error('[auth/register]', err.message);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    const valid = user && await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(401).json({ message: 'Invalid email or password.' });

    return res.status(200).json({
      message: 'Login successful.',
      token:   signToken(user),
      user:    userPayload(user),
    });
  } catch (err) {
    console.error('[auth/login]', err.message);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers['authorization'] ?? '';
    if (!authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided.' });

    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    return res.status(200).json({ user: userPayload(decoded) });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
