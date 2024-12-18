const { User, validateReg } = require('../db/userModel');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const SECRET = process.env.SECRET;
const jwtExpirySeconds = 300; // Token expiry time

const registerRouter = app.post('/register', async (req, res) => {
  // Validate the registration data
  const { error } = validateReg(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message }); // Return validation error
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).json({ message: 'User already exists. Please sign in.' }); // User conflict
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: 'user', // Default role is 'user'. Modify based on your requirements
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token with user info
    const tokenPayload = { id: user._id, role: user.role };
    const token = jwt.sign(tokenPayload, SECRET, { expiresIn: jwtExpirySeconds });

    // Send the response with the token, role, and redirect path
    const redirectTo = user.role === 'admin' ? '/admin-dashboard' : '/projects'; // Role-based redirection

    res.status(201).json({
      message: 'Successfully registered',
      token, // Send token
      role: user.role,
      redirectTo,
    });

  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({ message: 'Internal server error.' }); // General error
  }
});

module.exports = registerRouter;
