const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email и password обязательны' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash, name });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email и password обязательны' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // CSRF-токен — генерируем при логине, сохраняем в БД
    const csrfToken = crypto.randomBytes(32).toString('hex');
    user.csrfToken = csrfToken;
    await user.save();

    res.json({ token, csrfToken });
  } catch (err) {
    next(err);
  }
});

module.exports = router;