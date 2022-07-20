const express = require('express');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

exports.Booking = async (req, res) => {
    const { car, bookingDate, returnDate, location } = req.body;
    try {
        let id = req.user;
        let user = await User.findById(id);
        let car = await Car.findById(req.body.car);

        if (!user || !car) {
            return res.status(400).json('This car is unavailable...');
        }

        else if(car.status === "unavailable") {
            return res.status(404).json({ message: 'This car is already booked!!!'});
        }

        let booking = await Booking.create({ user, car, bookingDate, returnDate, location });
        if (!booking) {
            return res.status(404).json({ message: 'failed to create booking' });
        }
        console.log(car.status);
        car.status = 'unavailable';
        await car.save();
        console.log('Afterwards: ', car);
        return res.status(202).json({ message: 'Success', booking });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.cancelBooking = async (req, res) => {
    let id = req.params.id;
    try {
        const booking = await Booking.findById(id).populate('car');
        if (!booking) {
            return res.status(404).json('This booking does not exist');
        }
        let car = await booking.car;
        car.status = 'available';
        let cancelledBooking = await booking.delete();

        if (!cancelledBooking) {
            return res.status(404).json('Could not cancel this booking, try again later');
        }

        const data = {
            message: 'Delete succesful',
            details: cancelledBooking
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.getAll = async (req, res) => {
    let bookings = await Booking.find();

    try {
        if (bookings) {
            return res.status(200).json(bookings);
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};
