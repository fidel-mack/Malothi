const express = require("express");
const Notification = require("../models/Notification");
const { authMiddleware } = require("../middleware/auth");
const { ApiResponse } = require("../middleware/apiResponse");

const router = express.Router();

// Get user's notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;

    const notifications = await Notification.getByUserId(user_id, limit, offset);

    return res.json(
      new ApiResponse(200, notifications, "Notifications fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Get unread count
router.get("/unread-count", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const count = await Notification.getUnreadCount(user_id);

    return res.json(
      new ApiResponse(200, { count }, "Unread count fetched successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Mark notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.markAsRead(id);

    return res.json(
      new ApiResponse(200, notification, "Notification marked as read", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Mark all as read
router.put("/all/read", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const notifications = await Notification.markAllAsRead(user_id);

    return res.json(
      new ApiResponse(200, notifications, "All notifications marked as read", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

// Delete notification
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.deleteNotification(id);

    return res.json(
      new ApiResponse(200, null, "Notification deleted successfully", true)
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      new ApiResponse(500, null, "Server error", false)
    );
  }
});

module.exports = router;
