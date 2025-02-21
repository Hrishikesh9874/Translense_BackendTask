const Owner = require('../models/ownerModel');
const generateOtp = require('../utils/generateOtp');
const { smsOtp } = require('../services/smsOtpService');
const { mailOtp } = require('../services/mailOtpService');
const {uploadImageToCloudinary} = require('../services/uploadService');


const createOwner = async (req, res) => {
    const body = req.body;
    try {
        const owner = new Owner(body);
        await owner.save();
        res.status(201).json({owner});
    } catch (error) {
        res.status(500).json({error: error.message}); 
    }
}

const updateOwner = async (req, res) => {
    const {id} = req.params;
    const body = req.body;
    try {
        const owner = await Owner.findByIdAndUpdate(id,
            { $set: body },
            { new: true, runValidators: true }
        );
        if(!owner){
            return res.status(400).json({error: 'Business not found!'});
        }

        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deleteOwner = async (req, res) => {
    const {id} = req.params;
    try {
        const owner = await Owner.findById(id);
        if(!owner){
            return res.status(400).json({error: 'Owner not found!'});
        }
        await Owner.findByIdAndDelete(id);
        res.status(200).json({message: 'Owner deleted!'});
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

        const owner = await Owner.findOneAndUpdate({phone}, {
            otp,
            otpExp: otpExpiringTime
        },{
            new: true
        });

        if(!owner){
            return res.status(400).json({error: 'Owner not found!'});
        }

        await smsOtp(phone, otp);

        res.status(200).json({message: `SMS send to ${owner.name}'s phone`});

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
        const owner = await Owner.findOne({phone});
        if(!owner){
            return res.status(400).json({error: 'Owner not found!'});
        }

        if(owner.otp !== otp){
            return res.status(400).json({error: 'Invalid otp'});
        }

        const currentTime = new Date();
        const otpExpTime = new Date(owner.otpExp);
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

        const owner = await Owner.findOneAndUpdate({email}, {
            otp,
            otpExp: otpExpiringTime
        },{
            new: true
        });

        if(!owner){
            return res.status(400).json({error: 'Owner not found!'});
        }

        await mailOtp(email, otp);
        res.status(200).json({message: `Email send to ${owner.name}'s mail`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const verifyMailOtp = async (req, res) => {
    const {email, otp} = req.body;
    if(!otp || otp.length != 6){
        return res.status(400).json({error: 'Provide a valid otp'});
    }
    if(!email){
        return res.status(400).json({error: 'Provide email'});
    }

    try {
        const owner = await Owner.findOne({email});
        if(!owner){
            return res.status(400).json({error: 'Owner not found!'});
        }

        if(owner.otp !== otp){
            return res.status(400).json({error: 'Invalid otp'});
        }

        const currentTime = new Date();
        const otpExpTime = new Date(owner.otpExp);
        if(currentTime > otpExpTime){
            return res.status(400).json({error: 'OTP has expired'});
        }
        
        return res.status(200).json({message: 'OTP verified successfully!'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getOwner = async (req, res) => {
    const {id} = req.params;
    try {
        const owner = await Owner.findById(id);
        if(!owner){
            return res.send(400).json({error: 'Owner not found'})
        }
        res.status(200).json(owner);
    } catch (error) {
        res.json(500).json({error: error.message});
    }
}

const uploadImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const {id} = req.params;
    try {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer);
        let owner;
        if(imageUrl){
            owner = await Owner.findByIdAndUpdate(id, { imgUrl: imageUrl }, {new: true});
        }
        if(!owner){
            return res.status(400).json({error: 'No Owner found!'});
        }
        res.status(200).json(owner);
    } catch (error) {
        console.log('came');
        res.status(500).json({ error: error.message });
    }
}


module.exports = {uploadImage, getOwner, verifyMailOtp, sendMailOtp, verifySmsOtp, sendSmsOtp, createOwner, updateOwner, deleteOwner};