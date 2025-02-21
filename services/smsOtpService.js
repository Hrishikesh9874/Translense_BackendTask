const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config()


const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const number = process.env.TWILIO_PHONE;
const client = new twilio(sid, token);

const smsOtp = async (phone, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP is ${otp}. It is valid for 10 minutes. Do not share this code with anyone. - [TRANSLENSE]`,
            from: number,
            to: `+91${phone}`
        });
    } catch (error) {
        console.log('Error sending SMS: ', error.message);
    }
}

module.exports = { smsOtp };