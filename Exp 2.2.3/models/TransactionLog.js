const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  fromAccount: String,
  toAccount: String,
  amount: Number,
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);