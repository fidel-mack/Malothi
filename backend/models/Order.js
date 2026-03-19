const { pool } = require("../config/database");

const Order = {
  async initTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_number VARCHAR(50) UNIQUE NOT NULL,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          total_amount DECIMAL(10, 2) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          items JSONB NOT NULL,
          store_owner_ids UUID[] DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("✅ Orders table ready");
    } catch (error) {
      console.error("❌ Order table error:", error.message);
    }
  },

  async create({ order_number, user_id, total_amount, phone, items, store_owner_ids = [] }) {
    const result = await pool.query(
      `INSERT INTO orders (order_number, user_id, total_amount, phone, items, store_owner_ids, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')
       RETURNING *`,
      [order_number, user_id, total_amount, phone, JSON.stringify(items), store_owner_ids]
    );
    return result.rows[0];
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getByOrderNumber(order_number) {
    const result = await pool.query(
      `SELECT * FROM orders WHERE order_number = $1`,
      [order_number]
    );
    return result.rows[0];
  },

  async getByUserId(user_id) {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  async getAll(limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        SUM(total_amount) as total_revenue
      FROM orders
    `);
    return result.rows[0];
  },

  async getByStoreOwnerId(store_owner_id) {
    // Get all orders that contain products from this store owner
    const result = await pool.query(
      `SELECT * FROM orders WHERE $1 = ANY(store_owner_ids) ORDER BY created_at DESC LIMIT 100`,
      [store_owner_id]
    );
    return result.rows;
  },
};

module.exports = Order;
