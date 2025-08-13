const express = require('express');
const {
    generateBillFromOrder,
    getBillDetails,
    getRestaurantBillHistory,
} = require('../controllers/billController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate-from-order/:orderId', protect, authorizeRoles('cashier', 'admin'), generateBillFromOrder);
router.get('/:billId', protect, authorizeRoles('cashier', 'admin'), getBillDetails);
router.get('/restaurant/:restaurantId', protect, authorizeRoles('cashier', 'admin'), getRestaurantBillHistory);

module.exports = router;