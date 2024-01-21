const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    Username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    teamNumber: String,
    userType: {
        type: String,
        enum: ['user', 'admin', 'mentor', 'mentee'],
        default: 'user',
    },
    stack: {
        type: String,
        enum: ['frontend', 'backend', 'fullstack', 'mobile'],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('users', UserSchema)
