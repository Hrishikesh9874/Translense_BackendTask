const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const mailOtp = (email, otp) => {
  return new Promise((resolve, reject) => {
    const receiver = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP from Translense",
      text: `Your OTP is ${otp}. It is valid for 10 minutes. Do not share this code with anyone. - [TRANSLENSE]`,
    };

    transporter.sendMail(receiver, (error, info) => {
      if (error) {
        console.log("Error sending mail:", error.message);
        return reject({ success: false, message: "Failed to send email" });
      } else {
        return resolve({ success: true, message: "OTP sent successfully" });
      }
    });
  });
};

module.exports = { mailOtp };