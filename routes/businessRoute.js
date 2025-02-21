const express = require('express');
const {uploadImage, getBusiness, createBusiness, updateBusiness, deleteBusiness, sendSmsOtp, verifySmsOtp, sendMailOtp, verifyMailOtp} = require('../controller/businessController');
const upload = require('../config/multer');

const router = express.Router();


router.post('/create', createBusiness);
router.patch('/update/:id', updateBusiness);
router.delete('/delete/:id', deleteBusiness);
router.post('/send-sms', sendSmsOtp);
router.post('/verify-sms', verifySmsOtp);
router.post('/send-mail', sendMailOtp);
router.post('/verify-mail', verifyMailOtp);
router.get('/get/:id', getBusiness);
router.post('/image-upload/:id', upload.single("image"), uploadImage);


module.exports = router;