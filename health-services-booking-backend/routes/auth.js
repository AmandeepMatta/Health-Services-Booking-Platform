const express = require('express');
const bcrypt = require('bcryptjs');  // Corrected spelling
const jwt = require('jsonwebtoken');
const pool = require('../models/db.js');
const router = express.Router();

require('dotenv').config();

// Registration Route
router.post('/register', async (req, res) => {
    const { username, email, password, phone, address, role } = req.body;  // Extract phone and address
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Insert the new user into the database
      const newUser = await pool.query(
        'INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [username, email, hashedPassword, role]
      );
  
      // Insert initial profile record for the user
      await pool.query(
        'INSERT INTO Profile (user_id, phone, address) VALUES ($1, $2, $3)',
        [newUser.rows[0].id, phone, address]
      );
  
      const token = jwt.sign({ id: newUser.rows[0].id, role: role }, process.env.JWT_SECRET);
      res.json({ token, userId: newUser.rows[0].id });  // Include userId in the response
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

        const token = jwt.sign(
            { user: { id: user.rows[0].id, role: user.rows[0].role } },  // Ensure role is included
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Make sure you're sending the userId in the response
        res.json({ token, userId: user.rows[0].id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
