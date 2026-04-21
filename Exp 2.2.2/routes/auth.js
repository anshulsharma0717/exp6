router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const user = new User({ name, email, password });
    await user.save();  // bcrypt pre-save hook fires here
    res.status(201).json({
      message: 'User registered successfully',
      accountNumber: user.accountNumber
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


