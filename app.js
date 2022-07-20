const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
dotenv.config();
const { dbConfig } = require('./config/dbConfig.js');
const userRoutes = require('./Routes/user-routes');
const carRoutes = require('./Routes/car-Route');
const bookingRoutes = require('./Routes/Booking-Route');
const port = process.env.PORT || 3322;

const app = express();
process.env.TZ = 'Africa/Lagos';
dbConfig();

app.use(express.raw());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/uploads`));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('API running...');
});

// Imported routes
app.use('/api/user', userRoutes);
app.use('/api/car', carRoutes);
app.use('/api/booking', bookingRoutes);

app.listen(port, () => {
    console.log('\x1b[33m%s\x1b[0m', `Car Server running on Port:${port}`);
});

console.log('\x1b[33m%s\x1b[0m', app.get('env'));
