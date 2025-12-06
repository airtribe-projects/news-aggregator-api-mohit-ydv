const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true
    },
    preferences: {
        type: [String],
        default: []
    },
    readArticles: [{ type: String }],
    favoriteArticles: [{ type: String }],
})

module.exports = mongoose.model('User', userSchema);