import express from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";

const router = express.Router();

// 🔹 Create a new order
router.post("/", async (req, res) => {
  const {
    user,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = new Order({
    user,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  try {
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Get all orders (admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Get orders of a single user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate(
      "user",
      "name email"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
