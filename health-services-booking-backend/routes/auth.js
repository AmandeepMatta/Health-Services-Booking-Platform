const express = require('express');
const bcrypt = require('bcryptjs');  // Corrected spelling
const jwt = require('jsonwebtoken');
const pool = require('../models/db.js');
const router = express.Router();

require('dotenv').config();

// Registration Route
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);  // Corrected variable name and bcrypt spelling
        const newUser = await pool.query(
            'INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, role]
        );
        const token = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET);

        // Make sure you're sending the userId in the response
        res.json({ token, userId: user.rows[0].id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
