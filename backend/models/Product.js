const { pool } = require("../config/database");

const Product = {
  async initTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          category VARCHAR(50) NOT NULL,
          stock INTEGER DEFAULT 0,
          image_url VARCHAR(500),
          store_owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
          rating DECIMAL(3, 2) DEFAULT 0,
          reviews_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("✅ Products table ready");
    } catch (error) {
      console.error("❌ Product table error:", error.message);
    }
  },

  async create({ name, description, price, category, stock, image_url, store_owner_id }) {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, image_url, store_owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, price, category, stock, image_url, store_owner_id]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      `SELECT id, name, description, price, category, stock, image_url, rating, reviews_count, created_at 
       FROM products WHERE stock > 0 ORDER BY created_at DESC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getByCategory(category) {
    const result = await pool.query(
      `SELECT id, name, description, price, category, stock, image_url, rating, reviews_count
       FROM products WHERE category = $1 AND stock > 0 ORDER BY created_at DESC`,
      [category]
    );
    return result.rows;
  },

  async getByStoreOwner(store_owner_id) {
    const result = await pool.query(
      `SELECT * FROM products WHERE store_owner_id = $1 ORDER BY created_at DESC`,
      [store_owner_id]
    );
    return result.rows;
  },

  async update(id, { name, description, price, category, stock, image_url }) {
    const result = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category = COALESCE($4, category),
           stock = COALESCE($5, stock),
           image_url = COALESCE($6, image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, description, price, category, stock, image_url, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  },

  async updateStock(id, quantity) {
    const result = await pool.query(
      `UPDATE products 
       SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND stock >= $1
       RETURNING *`,
      [quantity, id]
    );
    return result.rows[0];
  },

  async search(searchTerm) {
    const result = await pool.query(
      `SELECT id, name, description, price, category, stock, image_url, rating, reviews_count
       FROM products WHERE name ILIKE $1 OR description ILIKE $1 AND stock > 0
       ORDER BY created_at DESC`,
      [`%${searchTerm}%`]
    );
    return result.rows;
  },
};

module.exports = Product;
