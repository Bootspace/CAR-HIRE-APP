const { check, validationResult } = require('express-validator');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.userValidationRules = () => {
    return [
        // Email must be an email
        check('email', 'Please enter a valid email').trim().isEmail(),

        // firstname must be entered
        check('firstname', 'Please fill this field').isString().not().isEmpty(),

        // lastname must be entered
        check('lastname', 'Please fill this field').isString().not().isEmpty(),

        // Username must be valid
        check('username', 'Please fill this field').isString().not().isEmpty(),

        // Password must have atleast 8 characters long
        check('password', 'Password must be atleast 6 digits long').isLength({ min: 6 })
    ];
};

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const exractedErrors = [];
    errors.array().map((err) => exractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: exractedErrors
    });
};

exports.generateJWT = async (user) => {
    let token = await jwt.sign(
        {
            _id: user.id,
            email: user.email
        },
        process.env.SECRET,
        { expiresIn: '7d' }
    );
    return token;
};
