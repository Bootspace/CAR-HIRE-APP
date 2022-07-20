const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const URI = process.env.MONGO_URL;

module.exports.dbConfig = () => {
    mongoose
        .connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then((result) => {
            console.log('\x1b[33m%s\x1b[0m', `Database Connected`);
        })
        .catch((e) => {
            console.log(e.message);
        });
};
