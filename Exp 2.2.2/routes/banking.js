const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

// Balance
router.get('/balance', async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ balance: user.balance });
});

// Deposit
router.post('/deposit', async (req, res) => {
  const { amount } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { balance: amount } },
    { new: true }
  );

  res.json({ balance: user.balance });
});

// Withdraw
router.post('/withdraw', async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.user.id);

  if (user.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  user.balance -= amount;
  await user.save();

  res.json({ balance: user.balance });
});

module.exports = router;