const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller');

router.post('/sendOrderConfirmation', emailController.sendOrderConfirmationEmail);

module.exports = router;
