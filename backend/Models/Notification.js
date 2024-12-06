class Notification {
    constructor(id, message, isRead = false) {
      this.id = id;
      this.message = message;
      this.isRead = isRead;
    }
  }
  
  module.exports = Notification;