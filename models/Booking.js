const mongoose = require('mongoose');
const User = require('./User');
const Car = require('./Car');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User
    },

    car: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Car,
        required: true
    },

    bookingDate: {
        type: Date,
        default: Date.now,
        immutable: true
    },

    returnDate: {
        type: Date,
        required: true
    },

    location: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
