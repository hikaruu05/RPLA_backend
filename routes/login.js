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
    } else {
        try {
            let user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ message: 'Incorrect email or password.' })
            }
            const correctPassword = await bcrypt.compare(req.body.password, user.password)
            if (!correctPassword) {
                return res.status(400).json({ message: 'Incorrect email or password.' })
            }
            const token = jwt.sign({ id: user._id }, SECRET)
            res.cookie(
                "token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: "strict",
                maxAge: jwtExpirySeconds * 1000
            })
            res.json({ 
                message: 'Successfully logged in', 
                redirectTo: '/projects' // Diubah ketika sudah ada interface dari frontend
            });
            } catch (err) {
            return res.status(400).json({ message: err.message })
        }
    }
    })

module.exports = loginRouter