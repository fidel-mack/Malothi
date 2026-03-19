const { pool } = require("../config/database");

const Notification = {
  async initTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("✅ Notifications table ready");
    } catch (error) {
      console.error("❌ Notification table error:", error.message);
    }
  },

  async create({ user_id, order_id, type, title, message }) {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, order_id, type, title, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, order_id, type, title, message]
    );
    return result.rows[0];
  },

  async getByUserId(user_id, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );
    return result.rows;
  },

  async markAsRead(notification_id) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [notification_id]
    );
    return result.rows[0];
  },

  async markAllAsRead(user_id) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND is_read = FALSE RETURNING *`,
      [user_id]
    );
    return result.rows;
  },

  async getUnreadCount(user_id) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
      [user_id]
    );
    return result.rows[0].count;
  },

  async deleteNotification(notification_id) {
    const result = await pool.query(
      `DELETE FROM notifications WHERE id = $1 RETURNING *`,
      [notification_id]
    );
    return result.rows[0];
  },
};

module.exports = Notification;
