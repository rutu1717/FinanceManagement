const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Service type is required'],
        unique: true
    },
    code: {
        type: String,
        required: [true, 'Service code is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    imgUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    detail: {
        type: Array,
        required: [true, 'Details are required']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);