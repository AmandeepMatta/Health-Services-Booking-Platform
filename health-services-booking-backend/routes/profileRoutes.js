const express = require('express');
const router = express.Router();
const pool = require('../models/db.js'); // Adjust the path if necessary
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this path is correct

// Get profile by user ID
router.get('/profile/:id', authMiddleware, async (req, res) => {
    console.log('req.user:', req.user);  // Debugging line
    const { id } = req.params;

    try {
        if (req.user.role === 'patient' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const profileQuery = `
            SELECT u.username, u.email, u.role, p.phone, p.address, p.medical_history 
            FROM users u 
            JOIN profile p ON u.id = p.user_id 
            WHERE u.id = $1
        `;
        const profile = await pool.query(profileQuery, [id]);

        if (profile.rows.length === 0) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        res.json(profile.rows[0]);
    } catch (error) {
        console.error(error.message);
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
// Route for patients to update their own profile (excluding medical history)
router.put('/profile/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { username, email, phone, address, medical_history } = req.body;

    try {
        // Ensure the user is a doctor or admin, or the patient editing their own data
        if (req.user.role !== 'doctor' && req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // Ensure `medical_history` is set to a string or handle null
        const medicalHistoryValue = medical_history ? medical_history : ''; // Default to empty string if null

        // Update the patient's profile in the Profile table
        const updateProfileQuery = `
            UPDATE profile 
            SET phone = $1, address = $2, medical_history = $3::text  -- Explicitly cast to text
            WHERE user_id = $4 
            RETURNING *`;
        const updatedProfile = await pool.query(updateProfileQuery, [phone, address, medicalHistoryValue, id]);

        // Update the patient's name and email in the Users table
        const updateUserQuery = 'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *';
        const updatedUser = await pool.query(updateUserQuery, [username, email, id]);

        res.json({ profile: updatedProfile.rows[0], user: updatedUser.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});





// Fetch all patients (accessible only by doctors or admins)
router.get('/patients', authMiddleware, async (req, res) => {
    try {
        // Ensure the user is a doctor or admin
        if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // Fetch all patients, excluding doctors/admins
        const patientsQuery = 'SELECT id, username, email FROM users WHERE role = $1';
        const patients = await pool.query(patientsQuery, ['patient']);

        res.json(patients.rows); // Send patient data to the frontend
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
