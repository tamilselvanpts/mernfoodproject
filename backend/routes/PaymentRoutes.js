const express = require('express');
const router = express.Router();

// Dummy Payment Model (or replace with actual mongoose model)
const Payment = require('../models/Payment'); // Ensure you create this schema

// POST /api/payments
router.post('/', async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json({ message: 'Payment stored successfully' });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
