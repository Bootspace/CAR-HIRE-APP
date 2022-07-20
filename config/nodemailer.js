require('dotenv').config();
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const sendEmail = async (options, attachment = false) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MYEMAIL,
            pass: process.env.MYPASSWORD
        }
    });

    try {
        const message = {
            from: `${process.env.SMTP_FROM_NAME} > ${process.env.SMTP_USER}`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.message
        };

        const m = await transporter.sendMail(message);
        console.log(m);
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;
