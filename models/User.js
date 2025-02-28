const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number
    }
},{timestamps:true})

UserSchema.pre('save',async function (next) {
    const user =this
    if (!user.isModified('password')) {
        next()
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        user.password = hash
        next()
})

const User = mongoose.model('User',UserSchema)
module.exports = User