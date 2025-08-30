/*import express from "express";
import Product from "../models/product.js";
import User from "../models/user.js";

const router = express.Router();

// CREATE Product (Only seller)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, sellerId } = req.body;

    // check if user is a seller
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add products" });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      seller: sellerId,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// GET all products (for customers)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
*/
import express from "express";
import Product from "../models/product.js";
import User from "../models/user.js";
import { Types } from "mongoose";

const router = express.Router();

// CREATE Product (Only seller)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, sellerId } = req.body;
    console.log("Received sellerId:", sellerId);
    console.log("Type of sellerId:", typeof sellerId);
    const seller = await User.findById(new Types.ObjectId(sellerId));
    console.log("Seller found:", seller);
    if (!seller || seller.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add products" });
    }
    const product = new Product({ name, description, price, stock, seller: new Types.ObjectId(sellerId) });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all products (for customers)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;




