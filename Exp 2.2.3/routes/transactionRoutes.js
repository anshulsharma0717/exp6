const express = require("express");
const router = express.Router();
const { transferMoney } = require("../controllers/transactionController");

// POST: transfer money
router.post("/transfer", transferMoney);

module.exports = router;