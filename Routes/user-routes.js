const express = require('express');
const router = express.Router();
const { isAuthUser } = require('../Middleware/isAuth');
const { userValidationRules, validate } = require('../config/validator');
const userController = require('../Controllers/user-controller');

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.get('/', userController.getAll);
router.put('/:id/favorites', isAuthUser, userController.favorites);
router.post('/verify', isAuthUser, userController.verify);
router.post('/resetpassword/:id', userController.resetPassword);
// router.post('/escrow', userController.escrow);

module.exports = router;
