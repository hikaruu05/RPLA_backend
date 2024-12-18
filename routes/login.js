// login function using bcrypt and jsonwebtoken for authentication

require('dotenv').config()
const { User, validateLogin } = require('../db/userModel')
const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express();
const SECRET = process.env.SECRET
const jwtExpirySeconds = 300

const loginRouter = app.post('/login', async (req, res) => {
    const { error } = validateLogin(req.body)
    if (error) {
        return res.status(401).send(error.details[0].message)
    }
        try {
            let user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ message: 'Incorrect email or password.' });
            }
            const correctPassword = await bcrypt.compare(req.body.password, user.password)
            if (!correctPassword) {
                return res.status(400).json({ message: 'Incorrect email or password.' });
            }
            const tokenPayload = { id: user._id, role: user.role };
            const token = jwt.sign(tokenPayload, SECRET, { expiresIn: jwtExpirySeconds });
            res.cookie(
                "token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: "strict",
                maxAge: jwtExpirySeconds * 1000
            });

            const redirectTo = user.role ==='admin' ? '/dashboard' : '/dashboarduser';

            return res.json({
                message: `Successfully logged in as ${user.role}`,
                token, // Include token for frontend if needed
                role: user.role,
                redirectTo,
              });
            } catch (err) {
              console.error(err.message);
              return res.status(500).json({ message: 'Internal server error.' });
            }
          });
        
module.exports = loginRouter
