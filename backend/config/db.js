// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config(); // Load environment variables

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('MongoDB Connected...');
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1); // Exit process with failure
//     }
// };

// module.exports = connectDB;


// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log('✅ MongoDB Connected...');
//     } catch (err) {
//         console.error('❌ Error:', err.message);
//         process.exit(1);
//     }
// };

// 👇 function-ஐ நேரடியாக export செய்கிறோம்

// module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // No extra options
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
