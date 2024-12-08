const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a username!"],
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: [true, "Please provide an email!"], 
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: [8, "Password is 8 required to be 8 characters long!"],
        max: 100

    }
})

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(100).required()
    })
    return schema.validate(user)
}
function validateLog(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(100).required()
    })
    return schema.validate(user)
}
module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);
const User = mongoose.model('Users', userSchema)
module.exports.validateReg = validateUser
module.exports.validateLogin = validateLog
module.exports.User = User