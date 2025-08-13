// const express = require('express');
// const {
//     createBooking,
//     getCustomerBookings,
//     getRestaurantBookings,
//     updateBookingStatus,
// } = require('../controllers/bookingController');
// const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/', protect, authorizeRoles('customer'), createBooking);
// router.get('/customer/:customerId', protect, authorizeRoles('customer'), getCustomerBookings);
// router.get('/restaurant/:restaurantId', protect, authorizeRoles('admin'), getRestaurantBookings);
// router.put('/:bookingId/update-status', protect, authorizeRoles('admin'), updateBookingStatus);

// module.exports = router;

const express = require('express');
const {
    createBooking,
    getCustomerBookings,
    getRestaurantBookings,
    updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Create booking - allow any logged-in user
router.post('/', protect, createBooking);

// Get customer's bookings (customer & admin can view)
router.get('/customer/:customerId', protect, authorizeRoles('customer', 'admin'), getCustomerBookings);

// Admin: view all bookings for a restaurant
router.get('/restaurant/:restaurantId', protect, authorizeRoles('admin'), getRestaurantBookings);

// Admin: update booking status
router.put('/:bookingId/update-status', protect, authorizeRoles('admin'), updateBookingStatus);

module.exports = router;

