const Business = require('../models/businessModel');
const generateOtp = require('../utils/generateOtp');
const { smsOtp } = require('../services/smsOtpService');
const { mailOtp } = require('../services/mailOtpService');
const {uploadImageToCloudinary} = require('../services/uploadService');


const createBusiness = async (req, res) => {
    const body = req.body;
    try {
        const business = new Business(body);
        await business.save();
        res.status(201).json({business});
    } catch (error) {
        res.status(500).json({error: error.message}); 
    }
}

const updateBusiness = async (req, res) => {
    const {id} = req.params;
    const {body} = req.body;
    try {
        const business = await Business.findByIdAndUpdate(id,
            { $set: body },
            { new: true, runValidators: true }
        );
        if(!business){
            return res.status(400).json({error: 'Business not found!'});
        }

        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deleteBusiness = async (req, res) => {
    const {id} = req.params;
    try {
        const business = await Business.findById(id);
        if(!business){
            return re.status(400).json({error: 'Business not found!'});
        }
        await Business.findByIdAndDelete(id);
        res.status(200).json({message: 'Business deleted!'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const sendSmsOtp = async (req, res) => {
    const {phone} = req.body;
    if(phone.length != 10){
        return res.status(400).json({error: 'Provide a valid phone no'});
    }

    try {
        const otp = generateOtp();
        const otpExpiringTime = new Date();
        otpExpiringTime.setMinutes(otpExpiringTime.getMinutes() + 10);

        const business = await Business.findOneAndUpdate({phone}, {
            otp,
            otpExp: otpExpiringTime
        },{
            new: true
        });

        if(!business){
            return res.status(400).json({error: 'Business not found!'});
        }

        await smsOtp(phone, otp);
        res.status(200).json({message: `SMS send to ${business.name}'s phone`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const verifySmsOtp = async (req, res) => {
    const {phone, otp} = req.body;
    if(otp.length != 6){
        return res.status(400).json({error: 'Provide a valid otp'});
    }
    if(phone.length != 10){
        return res.status(400).json({error: 'Provide a valid phone number'});
    }

    try {
        const business = await Business.findOne({phone});
        if(!business){
            return res.status(400).json({error: 'Business not found!'});
        }

        if(business.otp !== otp){
            return res.status(400).json({error: 'Invalid otp'});
        }

        const currentTime = new Date();
        const otpExpTime = new Date(business.otpExp);
        if(currentTime > otpExpTime){
            return res.status(400).json({error: 'OTP has expired'});
        }
        
        return res.status(200).json({message: 'OTP verified successfully!'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const sendMailOtp = async (req, res) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json({error: 'Provide email'});
    }
    try {
        const otp = generateOtp();
        const otpExpiringTime = new Date();
        otpExpiringTime.setMinutes(otpExpiringTime.getMinutes() + 10);

        const business = await Business.findOneAndUpdate({email}, {
            otp,
            otpExp: otpExpiringTime
        },{
            new: true
        });

        if(!business){
            return res.status(400).json({error: 'Business not found!'});
        }

        await mailOtp(email, otp);
        res.status(200).json({message: `Email send to ${business.name}'s mail`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const verifyMailOtp = async (req, res) => {
    const {email, otp} = req.body;
    if(otp.length != 6){
        return res.status(400).json({error: 'Provide a valid otp'});
    }
    if(!email){
        return res.status(400).json({error: 'Provide email'});
    }

    try {
        const business = await Business.findOne({email});
        if(!business){
            return res.status(400).json({error: 'Business not found!'});
        }

        if(business.otp !== otp){
            return res.status(400).json({error: 'Invalid otp'});
        }

        const currentTime = new Date();
        const otpExpTime = new Date(business.otpExp);
        if(currentTime > otpExpTime){
            return res.status(400).json({error: 'OTP has expired'});
        }
        
        return res.status(200).json({message: 'OTP verified successfully!'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getBusiness = async (req, res) => {
    const {id} = req.params;
    try {
        const business = await Business.findById(id);
        if(!business){
            return res.send(400).json({error: 'Business not found'})
        }
        res.status(200).json(business);
    } catch (error) {
        res.json(500).json({error: error.message});
    }
}

const uploadImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const {id} = req.params;
    try {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer);
        let business;
        if(imageUrl){
            business = await Business.findByIdAndUpdate(id, { imgUrl: imageUrl }, {new: true});
        }
        if(!business){
            return res.status(400).json({error: 'No Business found!'});
        }
        res.status(200).json(business);
    } catch (error) {
        console.log('came');
        res.status(500).json({ error: error.message });
    }
}


module.exports = {uploadImage, getBusiness, createBusiness, updateBusiness, deleteBusiness, sendSmsOtp, verifySmsOtp, sendMailOtp, verifyMailOtp};