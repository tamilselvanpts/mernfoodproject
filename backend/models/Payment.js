const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    method: String,
    details: Object,
    amount: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
