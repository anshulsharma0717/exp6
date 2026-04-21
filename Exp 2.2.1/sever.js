const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();

// Built-in middleware
app.use(express.json());

// Custom logging middleware
app.use(logger);

// Routes
app.use("/api", userRoutes);

// Error handler (LAST)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});