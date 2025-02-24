require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => 
  console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// MenuItem Schema
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

// Routes

// Add a menu item
app.post("/menu", async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: "Name and price are required." });
        }
        const newItem = new MenuItem({ name, description, price });
        await newItem.save();
        res.status(201).json({ message: "Menu item added", item: newItem });
    } catch (error) {
        res.status(500).json({ error: "Error adding menu item" });
    }
});

// Fetch all menu items
app.get("/menu", async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ error: "Error fetching menu items" });
    }
});

// Start server
app.listen(`PORT, () => console.log(Server running on port http://localhost:${PORT})`);