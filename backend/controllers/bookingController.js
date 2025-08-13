// 

const TableBooking = require('../models/TableBooking');
const Restaurant = require('../models/Restaurant');

// @desc    Create a new table booking
// @route   POST /api/bookings
// @access  Private (All roles)
const createBooking = async (req, res) => {
    const { date, time, guests } = req.body;
    const customerId = req.user.id; // Logged-in user

    try {
        // Automatically get the default restaurant (AnnamFood)
        const restaurant = await Restaurant.findOne({ name: 'AnnamFOOD' });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Allow all logged-in roles
        // (Remove any "customer only" check)
        // If you still want to limit to customers and admin:
        // if (req.user.role !== 'customer' && req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Forbidden' });
        // }

        const booking = new TableBooking({
            restaurant: restaurant._id,
            customer: customerId,
            date: new Date(date),
            time,
            guests,
            status: 'pending', // Default status
        });

        await booking.save();
        res.status(201).json(booking);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get bookings for a specific customer
// @route   GET /api/bookings/customer/:customerId
// @access  Private (Customer)
const getCustomerBookings = async (req, res) => {
    try {
        if (req.user.id !== req.params.customerId) {
            return res.status(403).json({ message: 'Not authorized to view these bookings' });
        }

        const bookings = await TableBooking.find({ customer: req.params.customerId })
            .populate('restaurant', 'name');
        res.json(bookings);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get bookings for a specific restaurant (Admin view)
// @route   GET /api/bookings/restaurant/:restaurantId
// @access  Private (Admin)
const getRestaurantBookings = async (req, res) => {
    const { restaurantId } = req.params;
    const { filter } = req.query;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view bookings for this restaurant' });
        }

        let query = { restaurant: restaurantId };
        const now = new Date();

        if (filter === 'upcoming') {
            query.date = { $gte: now.toISOString().split('T')[0] };
        } else if (filter === 'past') {
            query.date = { $lt: now.toISOString().split('T')[0] };
        }

        const bookings = await TableBooking.find(query)
            .populate('customer', 'name email')
            .sort({ date: 1, time: 1 });

        res.json(bookings);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:bookingId/update-status
// @access  Private (Admin)
const updateBookingStatus = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    try {
        let booking = await TableBooking.findById(bookingId).populate('restaurant');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.restaurant || booking.restaurant.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    createBooking,
    getCustomerBookings,
    getRestaurantBookings,
    updateBookingStatus,
};
