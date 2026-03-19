const express = require("express");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

/* ✅ FIX: CORS MUST BE FIRST */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* INIT DB */
const initDB = async () => {
  await User.initTable();
  await Product.initTable();
  await Order.initTable();
};

initDB().catch(err => console.error("DB Init Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});