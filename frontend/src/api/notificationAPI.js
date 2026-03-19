import axios from "./axios";

const NotificationAPI = {
  async getNotifications(limit = 50, offset = 0) {
    try {
      const response = await axios.get(`/notifications?limit=${limit}&offset=${offset}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  async getUnreadCount() {
    try {
      const response = await axios.get("/notifications/unread-count");
      return response.data.data.count;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`/notifications/${notificationId}/read`);
      return response.data.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  async markAllAsRead() {
    try {
      const response = await axios.put("/notifications/all/read");
      return response.data.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await axios.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};

export default NotificationAPI;
