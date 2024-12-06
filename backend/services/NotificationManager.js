const Notification = require('../Models/Notification');

class NotificationManager {
  constructor() {
    this.notifications = []; 
  }

  addNotification(message) {
    const id = this.notifications.length + 1; 
    const notification = new Notification(id, message);
    this.notifications.push(notification);
    return notification; 
  }

  getAllNotifications() {
    return this.notifications; 
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id); 
    if (notification) {
      notification.isRead = true; 
    }
  }
}

module.exports = new NotificationManager(); 