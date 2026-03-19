const express = require("express");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/auth");
const { ApiResponse } = require("../middleware/apiResponse");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.getAll();
    return res.json(
      new ApiResponse(200, products, "Products fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.getByCategory(category);
    return res.json(
      new ApiResponse(200, products, "Products fetched by category", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json(
        new ApiResponse(404, null, "Product not found", false)
      );
    }

    return res.json(
      new ApiResponse(200, product, "Product fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Search products
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const products = await Product.search(query);
    return res.json(
      new ApiResponse(200, products, "Search results", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Create product (Store Owner only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body;
    const store_owner_id = req.user.id;

    if (!name || !price || !category) {
      return res.status(400).json(
        new ApiResponse(400, null, "Missing required fields", false)
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image_url,
      store_owner_id,
    });

    return res.status(201).json(
      new ApiResponse(201, product, "Product created successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Update product (Store Owner only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, image_url } = req.body;
    const store_owner_id = req.user.id;

    // Check if product belongs to the store owner
    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json(
        new ApiResponse(404, null, "Product not found", false)
      );
    }

    if (product.store_owner_id !== store_owner_id) {
      return res.status(403).json(
        new ApiResponse(403, null, "Unauthorized to update this product", false)
      );
    }

    const updatedProduct = await Product.update(id, {
      name,
      description,
      price,
      category,
      stock,
      image_url,
    });

    return res.json(
      new ApiResponse(200, updatedProduct, "Product updated successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Delete product (Store Owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const store_owner_id = req.user.id;

    // Check if product belongs to the store owner
    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json(
        new ApiResponse(404, null, "Product not found", false)
      );
    }

    if (product.store_owner_id !== store_owner_id) {
      return res.status(403).json(
        new ApiResponse(403, null, "Unauthorized to delete this product", false)
      );
    }

    await Product.delete(id);

    return res.json(
      new ApiResponse(200, { id }, "Product deleted successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get store owner's products
router.get("/owner/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.getByStoreOwner(userId);
    return res.json(
      new ApiResponse(200, products, "Store owner products fetched", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

module.exports = router;
