
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/send-verification', authController.sendVerificationCode);
router.post('/verify-email', authController.verifyEmail);
router.post('/google', authController.googleAuth);

module.exports = router;