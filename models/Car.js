const mongoose = require('mongoose');
const CarSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },

    Model: {
        type: String,
        required: true
    },

    Year: {
        type: String,
        required: true
    },

    engine: {
        type: String,
        required: true
    },

    color: {
        type: String
    },

    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },

    photos: [
        {
            imageUrl: {
                type: String
            },

            publicId: {
                type: String
            }
        }
    ]
});

module.exports = mongoose.model('Car', CarSchema);
