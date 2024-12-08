// register function using bcrypt

const { User, validateReg } = require('../db/userModel')
const bcrypt = require('bcrypt')
const express = require('express')
const app = express();
app.use(express.json());

const registerRouter = app.post('/register', 
    async (req, res) => {
    const { error } = validateReg(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).send('User already exists. Please sign in')
    } else {
        try {
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: password
            })
            await user.save()
            return res.status(201).json({ 
                message: 'Successfully registered', 
                redirectTo: '/project' // Path redireksi setelah berhasil registrasi
            })
         } catch (err) {
            return res.status(400).json({ message: err.message })
        }
    }
})

module.exports = registerRouter