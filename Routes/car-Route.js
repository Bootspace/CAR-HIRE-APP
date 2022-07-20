const express = require('express');
const router = express.Router();
const { cloudinary } = require('../config/cloudinary');
const upload = require('../config/multer');
const Car = require('../models/Car');
const User = require('../models/User');
const { isAuthUser } = require('../Middleware/isAuth');
const carController = require('../Controllers/car-controller');

router.post('/register', isAuthUser, carController.registerCar);
router.delete('/delete/:id', isAuthUser, carController.delete);
router.get('/', carController.getAll);
router.get('/available', carController.getAvailable);
router.get('/unavailable', carController.getBooked);
router.get('/deletephoto/:id/:publicId', carController.deletePhoto);

router.put('/upload/:id', isAuthUser, upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);
        // Updating thr car document
        const updatedCar = await Car.updateOne(
            {
                _id: req.params.id
            },
            {
                $push: {
                    photos: {
                        $each: [
                            {
                                imageUrl: result.url,
                                publicId: result.public_id
                            }
                        ]
                    }
                }
            }
        );
        return res.status(200).json(updatedCar);
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json(error.stack);
    }
});

module.exports = router;
