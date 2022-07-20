const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/Booking-Controller');
const { isAuthUser } = require('../Middleware/isAuth');

router.post('/', isAuthUser, bookingController.Booking);
router.delete('/cancel/:id', isAuthUser, bookingController.cancelBooking);
router.get('/', bookingController.getAll);

module.exports = router;
