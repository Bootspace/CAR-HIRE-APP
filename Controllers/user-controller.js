require('dotenv').config();
const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const bcrypt = require('bcrypt');
const { OtpGenerate } = require('../config/otp');
const { generateJWT } = require('../config/validator');
const sendEmail = require('../config/nodemailer');
const { sendEmailTemp } = require('../config/templates/emailTemplate');
const log = console.log;
const otp = OtpGenerate();

// const vesicashPub = process.env.VESICASH_PUBLIC_KEY;
// const vesicashPriv = process.env.VESICASH_PRIVATE_KEY;
// const uri = 'https://api.vesicash.com/v1/';
// const headers = {
//     accept: 'application/json',
//     'V-PRIVATE-KEY': vesicashPriv
// };

/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.createUser = async (req, res) => {
    const { email, firstname, lastname, username, phone_number, city, complete_Address } = req.body;
    let password = req.body.password;

    const userFound = await User.findOne({ email });
    try {
        if (userFound) {
            return res.status(400).send('User exists');
        }
        // Hashing the password
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        password = hashedPassword;
        let user = await new User({ email, firstname, lastname, username, phone_number, city, complete_Address, password });

        let options = {
            email: user.email,
            subject: 'Registeration Details',
            message: await sendEmailTemp(otp)
        };

        let mailsend = await sendEmail(options);
        if (!mailsend) {
            return res.status(404).json('Email not sent');
        } else {
            console.log(mailsend);
        }
        let hashedOtp = await bcrypt.hash(otp, salt);
        user.otp = hashedOtp;
        const savedUser = await user.save();

        return res.status(200).json({ savedUser });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        let auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Generating Tokens
        let token = await generateJWT(user);

        const data = {
            message: 'Login succesful',
            details: user,
            token: token
        };
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.getAll = async (req, res) => {
    let users = await User.find();
    try {
        if (users) {
            return res.status(200).json(users);
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// exports.escrow = async (req, res) => {
//     const body = {
//         email_address: 'xofaubommuyi-9770@yopmail.com',
//         phone_number: '07067444369',
//         country: 'NG',
//         firstname: 'Paolo',
//         lastname: 'Nunez',
//         password: 'Greenday123',
//         username: 'Nunez'
//     };
//     try {
//         const resp = await axios.post(`${uri}auth/signup`, body, {
//             headers: headers
//         });
//         console.log(resp.data);
//         return res.status(200).json(resp.data);
//     } catch (error) {
//         res.status(400).json(error.message);
//     }
// };

exports.favorites = async (req, res) => {
    try {
        let car = await Car.findById(req.params.id);
        let user = await User.findById(req.user);
        if (!car) {
            return res.status(404).send('Car does not exist');
        }
        if (!user.favorites.includes(car._id)) {
            await user.updateOne({ $push: { favorites: car._id } });
            return res.status(200).json('Added to favorites ');
        } else {
            await user.updateOne({ $pull: { favorites: car._id } });
            return res.status(200).json('Removed from favorites ');
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

exports.verify = async (req, res) => {
    const { otp } = req.body;
    try {
        let user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json('Invalid User');
        }
        const verifiedOtp = await bcrypt.compare(otp, user.otp);
        if (!verifiedOtp) {
            return res.status(404).json('Failed to verify');
        }
        user.verified = true;
        user.otp = '';
        await user.save();
        console.log(user);
        return res.status(200).json(`User succesfully verified`);
    } catch (error) {
        return res.status(500).send(error);
    }
};

exports.resetPassword = async (req, res) => {
    const user = await User.findById(req.params.id);
    const { password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send(error);
    }
};
