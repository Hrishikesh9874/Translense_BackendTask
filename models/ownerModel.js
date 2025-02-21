const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format']
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String
    },
    otp: {
        type: String
    },
    otpExp: {
        type: Date
    }
}, {timestamps: true})

const Owner = mongoose.model('Owner', ownerSchema);
module.exports = Owner;