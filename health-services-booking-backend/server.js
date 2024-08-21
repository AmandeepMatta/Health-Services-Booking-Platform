const express = require('express');
const authRoutes = require('./routes/auth.js'); // Your auth routes file
const authMiddleware = require('./middleware/authMiddleware'); // Adjust the path as needed
const profileRoutes = require('./routes/profileRoutes.js'); // Adjust the path if necessary
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

// Public routes (DO NOT use authMiddleware here)
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);

// Example of a protected route (DO use authMiddleware here)
app.use('/api/protected', authMiddleware, (req, res) => {
    res.json({ msg: 'This is a protected route' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
