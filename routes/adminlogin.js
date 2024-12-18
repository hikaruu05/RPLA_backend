require('dotenv').config();
const { User, validateLogin } = require('../db/userModel');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET = process.env.SECRET;
const jwtExpirySeconds = 300;

const adminLoginRouter = app.post('/admin/login', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(401).send(error.details[0].message);
    } else {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user || !user.isAdmin) {
                return res.status(400).json({ message: 'Access denied. Admin only.' });
            }
            const correctPassword = await bcrypt.compare(req.body.password, user.password);
            if (!correctPassword) {
                return res.status(400).json({ message: 'Incorrect email or password.' });
            }
            const token = jwt.sign({ id: user._id, role: 'admin' }, SECRET);
            res.cookie(
                "token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: "strict",
                maxAge: jwtExpirySeconds * 1000
            });
            res.json({ 
                message: 'Admin successfully logged in', 
                redirectTo: '/admin/dashboard' // Adjust to match your admin interface
            });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
});

module.exports = adminLoginRouter;
