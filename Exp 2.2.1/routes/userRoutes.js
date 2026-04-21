const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hash });
    await user.save();

    res.json({ msg: "User registered" });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

// Protected Route
router.get("/profile", auth, (req, res) => {
  res.json({
    msg: "Protected Data Accessed",
    user: req.user
  });
});

module.exports = router;