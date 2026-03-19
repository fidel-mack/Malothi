const { pool } = require("../config/database");

const User = {
  async initTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100),
          email VARCHAR(150) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          type VARCHAR(20) DEFAULT 'man',
          role VARCHAR(20) DEFAULT 'CUSTOMER',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("✅ Users table ready");
    } catch (error) {
      console.error("❌ User table error:", error.message);
    }
  },

  async create({ name, email, password, type, role }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, type, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, type, role`,
      [name, email, password, type || "man", role || "CUSTOMER"]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT id, name, email, type, role FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },
};

module.exports = User;