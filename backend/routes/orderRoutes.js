const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const { authMiddleware } = require("../middleware/auth");
const { ApiResponse } = require("../middleware/apiResponse");

const router = express.Router();

// Create order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { phone, items } = req.body;
    const user_id = req.user.id;

    console.log("📥 Order Request Received:");
    console.log("  User ID:", user_id);
    console.log("  Phone:", phone);
    console.log("  Items:", JSON.stringify(items, null, 2));

    if (!phone || !items || items.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, null, "Missing required fields", false)
      );
    }

    // Calculate total amount
    const total_amount = items.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace("$", "")) 
        : parseFloat(item.price);
      const quantity = parseInt(item.quantity) || 1;
      console.log(`  Item: ${item.name}, Price: ${price}, Qty: ${quantity}, Subtotal: ${price * quantity}`);
      return total + (price * quantity);
    }, 0);

    console.log("  Total (before tax):", total_amount);

    // Add tax (10%)
    const final_amount = (total_amount * 1.1).toFixed(2);

    // Generate order number
    const order_number = `ORD-${Date.now()}`;

    // Collect unique store owners from items (with fallback for missing store_owner_id)
    const store_owner_ids = [];
    for (const item of items) {
      // If item has store_owner_id, use it; otherwise we can't assign to a store owner
      if (item.store_owner_id && !store_owner_ids.includes(item.store_owner_id)) {
        store_owner_ids.push(item.store_owner_id);
      }
    }
    
    console.log("  Store Owner IDs:", store_owner_ids);

    const order = await Order.create({
      order_number,
      user_id,
      total_amount: final_amount,
      phone,
      items,
      store_owner_ids,
    });

    console.log("✅ Order created:", order.order_number);

    // Create notifications for each store owner
    if (store_owner_ids.length > 0) {
      for (const store_owner_id of store_owner_ids) {
        await Notification.create({
          user_id: store_owner_id,
          order_id: order.id,
          type: "new_order",
          title: "New Order Received",
          message: `You have a new order #${order_number} for $${final_amount}`,
        });
      }
      console.log(`✅ Notifications sent to ${store_owner_ids.length} store owners`);
    } else {
      console.log("⚠️  No store owner IDs in this order");
    }

    return res.status(201).json(
      new ApiResponse(201, order, "Order created successfully", true)
    );
  } catch (err) {
    console.error("❌ Order Creation Error:", err.message);
    console.error("Stack:", err.stack);
    return res.status(500).json(
      new ApiResponse(500, null, err.message || "Server error", false)
    );
  }
});

// Get order by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, null, "Order not found", false)
      );
    }

    // Check authorization
    if (order.user_id !== req.user.id) {
      return res.status(403).json(
        new ApiResponse(403, null, "Unauthorized", false)
      );
    }

    return res.json(
      new ApiResponse(200, order, "Order fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get user's orders
router.get("/user/my-orders", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await Order.getByUserId(user_id);

    return res.json(
      new ApiResponse(200, orders, "User orders fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get store owner's orders
router.get("/store/owner-orders", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "STORE_OWNER") {
      return res.status(403).json(
        new ApiResponse(403, null, "Unauthorized", false)
      );
    }

    const orders = await Order.getByStoreOwnerId(req.user.id);

    return res.json(
      new ApiResponse(200, orders, "Store owner orders fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get order by order number
router.get("/number/:order_number", authMiddleware, async (req, res) => {
  try {
    const { order_number } = req.params;
    const order = await Order.getByOrderNumber(order_number);

    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, null, "Order not found", false)
      );
    }

    // Check authorization
    if (order.user_id !== req.user.id) {
      return res.status(403).json(
        new ApiResponse(403, null, "Unauthorized", false)
      );
    }

    return res.json(
      new ApiResponse(200, order, "Order fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Update order status (Admin/Store owner only)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.getById(id);
    if (!order) {
      return res.status(404).json(
        new ApiResponse(404, null, "Order not found", false)
      );
    }

    // Check authorization (only order creator or admin can update)
    if (order.user_id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json(
        new ApiResponse(403, null, "Unauthorized", false)
      );
    }

    const updatedOrder = await Order.updateStatus(id, status);

    return res.json(
      new ApiResponse(200, updatedOrder, "Order status updated", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get all orders (Admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json(
        new ApiResponse(403, null, "Unauthorized", false)
      );
    }

    const { limit = 50, offset = 0 } = req.query;
    const orders = await Order.getAll(limit, offset);

    return res.json(
      new ApiResponse(200, orders, "Orders fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get order statistics (Admin only)
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json(
        new ApiResponse(403, null, "Unauthorized", false)
      );
    }

    const stats = await Order.getStats();

    return res.json(
      new ApiResponse(200, stats, "Order statistics fetched", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

module.exports = router;
