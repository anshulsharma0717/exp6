const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// routes
app.use("/api", require("./routes/transactionRoutes"));

// server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});