import API from "./axios";

const OrderAPI = {
  // Create order
  async create(orderData) {
    const response = await API.post("/orders", orderData);
    return response.data.data;
  },

  // Get order by ID
  async getById(id) {
    const response = await API.get(`/orders/${id}`);
    return response.data.data;
  },

  // Get user's orders
  async getMyOrders() {
    const response = await API.get("/orders/user/my-orders");
    return response.data.data;
  },

  // Get order by order number
  async getByOrderNumber(orderNumber) {
    const response = await API.get(`/orders/number/${orderNumber}`);
    return response.data.data;
  },

  // Update order status
  async updateStatus(id, status) {
    const response = await API.put(`/orders/${id}/status`, { status });
    return response.data.data;
  },

  // Get all orders (Admin)
  async getAll(limit = 50, offset = 0) {
    const response = await API.get("/orders", {
      params: { limit, offset },
    });
    return response.data.data;
  },

  // Get order statistics (Admin)
  async getStats() {
    const response = await API.get("/orders/stats");
    return response.data.data;
  },

  // Get store owner's orders
  async getStoreOwnerOrders() {
    const response = await API.get("/orders/store/owner-orders");
    return response.data.data;
  },
};

export default OrderAPI;
