const mongoose = require("mongoose");
require('dotenv').config(); 

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};
