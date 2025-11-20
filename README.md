# ChatterUp – Real-Time Messaging App

ChatterUp is an engaging and interactive real-time messaging application designed to deliver smooth, fast, and seamless communication among users.  
Built using **Node.js**, **Express.js**, **Socket.io**, and **MongoDB**, the application ensures reliable messaging, real-time updates, and a dynamic chat experience.

---

## 🚀 Key Features

### **⚡ Real-Time Communication (Socket.io)**
Enables instant, two-way communication so users receive messages the moment they are sent.

### **🧩 Modular Code Design**
Uses ES6 Modules for a clean, maintainable structure that improves readability and collaboration.

### **💬 Intuitive User Interface**
A simple and responsive chat interface with a notification panel showing active users and updates.

### **👋 Smooth User Onboarding**
New users provide a name, receive a personalized welcome message, and see their name in the chat header.

### **📜 Chat History & User Count**
New users can view previous messages and see real-time updates of active users in the chat.

### **📡 Real-Time Message Broadcasting + Database Storage**
Messages are instantly broadcast to all users in the room and saved securely in MongoDB.

### **⌨️ Typing Indicators**
Shows a "typing..." notification when a user is composing a message.

### **🟢 Real-Time Join Notifications**
Every time a user joins, a green-dot status indicator and join alert appear for all users.

### **🔴 User Disconnection Alerts**
All users are notified when someone leaves, and the online user count updates accordingly.

### **🖼️ Profile Pictures**
Each user gets an auto-assigned profile picture displayed consistently beside messages.

### **💬 Detailed Message Display**
Every message includes:
- Sender’s name  
- Profile picture  
- Message text  
- Timestamp  

---

## 🛠️ Steps to Build the ChatterUp Application

### **1. Project Setup**
- Initialize an Express.js project  
- Configure file structure  
- Connect to MongoDB (Atlas or local)

### **2. Install Dependencies**
Install required packages: npm install express socket.io mongoose cors


### **3. Develop the User Interface**
- Build UI using HTML/CSS/JS or a frontend framework (React recommended)
- Add components for:
  - Chat window
  - Typing indicator
  - Online users panel
- Make layout responsive and appealing

### **4. Implement User Onboarding**
- Ask for username on first visit  
- Display personalized greetings  
- Store user info in session/state

### **5. Chat History + Active User Count**
- Fetch previous messages from MongoDB  
- Show real-time active user count using Socket.io rooms

### **6. Typing Indicators**
- Emit `"typing"` events  
- Display live typing notifications on client

### **7. Message Broadcasting + Storage**
- Emit `"new-message"` events for real-time delivery  
- Save each message to MongoDB with user details

### **8. New User Notifications**
- Emit `"user-joined"` event  
- Update notification panel for all users

### **9. Handle User Disconnect**
- Emit `"user-left"` event  
- Update online user count and panel

### **10. Profile Pictures**
- Auto-assign profile avatars  
- Display images across all message templates

### **11. Message UI with Metadata**
- Build a message component with:
  - Avatar  
  - Name  
  - Content  
  - Timestamp  

---

## 📡 API Structure

The API contains routes for:

- **Rendering UI pages**  
- **Delivering chat history**  
- **User onboarding**  
- **Saving messages**  
- **User connection and disconnection events**

This ensures smooth communication between the frontend and backend.

---

## 🏁 **Made with ❤️**

