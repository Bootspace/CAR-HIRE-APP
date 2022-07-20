const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Car = require('./Car');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true
        },

        lastname: {
            type: String,
            required: true
        },

        username: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        phone_number: {
            type: String,
            required: true
        },

        city: {
            type: String
        },

        list_of_cars: [
            {
                type: Schema.Types.ObjectId,
                ref: Car
            }
        ],

        favorites: [
            {
                type: Schema.Types.ObjectId,
                ref: Car
            }
        ],

        otp: {
            type: String,
            createdAt: {
                type: Date,
                default: Date.now,
                index: { expires: 3000 }
            }
        },

        verified: {
            type: Boolean,
            default: false
        },

        complete_Address: {
            type: String
        },

        photo: {
            type: String
        }
    },
    { timestamps: true }
);

// UserSchema.pre('save', async function (next) {
//     let salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    console.log(user);
    if (user) {
        let auth = await bcrypt.compare(this.password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect credentials');
    }
    throw Error('incorrect credentials');
};

module.exports = mongoose.model('User', UserSchema);
