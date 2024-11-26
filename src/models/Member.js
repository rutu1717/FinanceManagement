const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    occupation: {
        type: String,
        required: true
    },
    createpassword: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Member', memberSchema);