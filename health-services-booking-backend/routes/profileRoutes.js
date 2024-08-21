const express = require('express');
const router = express.Router();
const pool = require('../models/db.js'); // Adjust the path if necessary
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this path is correct

// Get profile by user ID
router.get('/profile/:id', authMiddleware, async (req, res) => {
    try {
      const profile = await pool.query(
        'SELECT u.username, u.email, p.phone, p.address, p.medical_history FROM users u INNER JOIN profile p ON u.id = p.user_id WHERE p.user_id = $1',
        [req.params.id]
      );
      if (profile.rows.length === 0) {
        return res.status(404).json({ msg: 'Profile not found' });
      }
      res.json(profile.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// Create a new profile
router.post('/profile', authMiddleware, async (req, res) => {
    const { userId, phone, address, medical_history } = req.body;
    try {
        const newProfile = await pool.query(
            'INSERT INTO Profile (user_id, phone, address, medical_history) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, phone, address, medical_history]
        );
        res.json(newProfile.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update profile
router.put('/profile/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;
    const { phone, address, medical_history } = req.body;
    try {
        const updatedProfile = await pool.query(
            'UPDATE Profile SET phone = $1, address = $2, medical_history = $3 WHERE user_id = $4 RETURNING *',
            [phone, address, medical_history, userId]
        );
        if (updatedProfile.rows.length === 0) {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        res.json(updatedProfile.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
