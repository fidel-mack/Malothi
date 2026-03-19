import API from "./axios";

const ProductAPI = {
  // Get all products
  async getAll() {
    const response = await API.get("/products");
    return response.data.data;
  },

  // Get products by category
  async getByCategory(category) {
    const response = await API.get(`/products/category/${category}`);
    return response.data.data;
  },

  // Get single product
  async getById(id) {
    const response = await API.get(`/products/${id}`);
    return response.data.data;
  },

  // Search products
  async search(query) {
    const response = await API.get(`/products/search/${query}`);
    return response.data.data;
  },

  // Create product (Store owner)
  async create(productData) {
    const response = await API.post("/products", productData);
    return response.data.data;
  },

  // Update product
  async update(id, productData) {
    const response = await API.put(`/products/${id}`, productData);
    return response.data.data;
  },

  // Delete product
  async delete(id) {
    const response = await API.delete(`/products/${id}`);
    return response.data.data;
  },

  // Get store owner's products
  async getByStoreOwner(userId) {
    const response = await API.get(`/products/owner/${userId}`);
    return response.data.data;
  },
};

export default ProductAPI;
