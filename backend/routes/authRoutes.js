const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { ApiResponse } = require("../middleware/apiResponse");
const { authMiddleware } = require("../middleware/auth");

/* SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, type, role } = req.body;

    const exists = await User.findByEmail(email);
    if (exists) {
      return res.status(400).json(
        new ApiResponse(400, null, "User already exists", false)
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      type,
      role: role || "CUSTOMER",
    });

    const token = generateToken(user);

    return res.json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            role: user.role,
          },
        },
        "User created successfully",
        true
      )
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json(
        new ApiResponse(404, null, "User not found", false)
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid credentials", false)
      );
    }

    const token = generateToken(user);

    return res.json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            role: user.role,
          },
        },
        "Login success",
        true
      )
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

/* TEST AUTH */
router.get("/me", authMiddleware, async (req, res) => {
  return res.json(
    new ApiResponse(200, req.user, "OK", true)
  );
});

module.exports = router;