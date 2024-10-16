const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const tenderRoutes = require("./routes/tender.routes");
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require("./routes/notification.route");
const { createDefaultUsers } = require("./scripts");
const cors = require('cors')


dotenv.config();
connectDB();
const app = express();
app.use(cors())
app.use(express.json());

// Routes
app.use("/api/v1", tenderRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  createDefaultUsers();
});
