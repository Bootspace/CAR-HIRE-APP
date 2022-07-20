require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.isAuthUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json('Token Missing');
        }

        const decodedToken = await jwt.verify(token, secret);
        if (!decodedToken) {
            throw new Error();
        }

        req.user = decodedToken._id;
        next();
    } catch (error) {
        return res.status(401).json('Register as a user!');
    }
};
