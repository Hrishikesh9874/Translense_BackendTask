const express = require('express');
const {uploadImage, getOwner, verifyMailOtp, sendMailOtp, verifySmsOtp, sendSmsOtp, createOwner, updateOwner, deleteOwner} = require('../controller/ownerController');
const upload = require('../config/multer');

const router = express.Router();

router.post('/create', createOwner);
router.patch('/update/:id', updateOwner);
router.delete('/delete/:id', deleteOwner);
router.post('/send-sms', sendSmsOtp);
router.post('/verify-sms', verifySmsOtp);
router.post('/send-mail', sendMailOtp);
router.post('/verify-mail', verifyMailOtp);
router.get('/get/:id', getOwner);
router.post('/image-upload/:id', upload.single("image"), uploadImage);

module.exports = router;