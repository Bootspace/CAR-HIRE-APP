const express = require('express');
const User = require('../models/User');
const Car = require('../models/Car');
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const storage = require('../config/multer');

exports.registerCar = async (req, res) => {
    const { Name, Model, Year, engine, color } = req.body;

    try {
        if (!(Name || Model || Year || engine || color)) {
            return res.status(400).json('Please fill all fields');
        }
        const car = await new Car({ Name, Model, Year, engine, color });
        const savedCar = await car.save();
        let user = await User.findById(req.user);
        await user.updateOne({ $push: { list_of_cars: savedCar._id } });
        console.log(user.list_of_cars);
        return res.status(200).json({ message: 'Succesful', savedCar });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.delete = async (req, res) => {
    let id = req.params.id;
    let user = await User.findById(req.user);
    try {
        let car = await Car.findByIdAndDelete(id);
        if (!car) {
            return res.status(404).json('Car does not exist');
        }

        await user.updateOne({ $pull: { list_of_cars: car._id } });
        console.log(user.list_of_cars);

        const data = {
            message: 'Delete succesful',
            details: car
        };

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.getAll = async (req, res) => {
    let cars = await Car.find();
    try {
        if (cars) {
            return res.status(200).json(cars);
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.getAvailable = async (req, res) => {
    let availableCars = await Car.find({ status: 'available' });
    try {
        if (availableCars) return res.status(200).json(availableCars);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.getBooked = async (req, res) => {
    let bookedCars = await Car.find({ status: 'unavailable' });
    try {
        if (bookedCars) return res.status(200).json(bookedCars);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        cloudinary.uploader.destroy(req.params.publicId, (error, result) => {
            console.log(error, result);
        });
        // Updating the Car Object
        const updatedCar = await Car.updateOne(
            {
                _id: req.params.id
            },
            {
                $pull: {
                    photos: {
                        publicId: req.params.publicId
                    }
                }
            }
        );
        return res.status(200).json(updatedCar);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};
