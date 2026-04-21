const mongoose = require("mongoose");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

// Transfer money between two accounts
exports.transferMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { from, to, amount } = req.body;

    // Basic validation
    if (!from || !to || !amount) {
      throw new Error("All fields are required");
    }

    // Fetch accounts inside transaction session
    const sender = await Account.findById(from).session(session);
    const receiver = await Account.findById(to).session(session);

    if (!sender || !receiver) {
      throw new Error("Invalid account");
    }

    // Check balance
    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Debit sender
    sender.balance -= amount;
    await sender.save({ session });

    // Credit receiver
    receiver.balance += amount;
    await receiver.save({ session });

    // Save success log
    await Transaction.create([{
      fromAccount: from,
      toAccount: to,
      amount,
      status: "SUCCESS"
    }], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.json({ message: "✅ Transfer successful" });

  } catch (err) {
    // Rollback everything
    await session.abortTransaction();
    session.endSession();

    // Save failed log (outside transaction)
    await Transaction.create({
      fromAccount: req.body.from,
      toAccount: req.body.to,
      amount: req.body.amount,
      status: "FAILED"
    });

    res.status(400).json({ error: "❌ " + err.message });
  }
};