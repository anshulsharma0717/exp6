const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/bankDB");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("❌ DB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;