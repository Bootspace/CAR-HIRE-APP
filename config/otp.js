const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');

exports.OtpGenerate = () => {
    const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: true,
        upperCase: false,
        specialChars: false
    });
    // console.log('From OTP gnerate: ', otp);
    return otp;
};
