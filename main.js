// Establish socket connection
const socket = io.connect(SOCKET_SERVER_URL || "http://localhost:4500");

// Handle connection errors
socket.on("connect_error", (err) => {
    console.error("Socket error:", err);
});

// Add this function below the socket connection code
function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}

// Utility function to scroll to the bottom of the chat
function scrollToBottom() {
    const messageList = document.getElementById("message-list");
    if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
    } else {
        console.error("Message list not found for scrolling.");
    }
}

// DOM elements
const myPrompt = document.getElementById("prompt");
const name = document.getElementById("name");
const messageInput = document.getElementById("text-message");
const sendMessageForm = document.getElementById("message-form");

// Define userImageMap and imageIndex globally
const userImageMap = new Map();
const imageIndex = 1;

// Display prompt on page load
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded, showing prompt"); // Debugging line
    myPrompt.style.display = "block"; // Show the prompt for name entry
});

// Prompt submission logic
myPrompt.addEventListener("submit", (event) => {
    
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the element with the ID 'welcome' to potentially display a welcome message
    const welcome = document.getElementById("welcome");
    
    // Sanitize and trim the input value from the 'name' field
    const user = sanitizeInput(name.value.trim());

    // Check if the sanitized user input is empty or invalid
    if (!user) {
        alert("Please enter a valid name.");
        return;
    }

    // Display welcome message and hide the prompt
    welcome.innerText = `Welcome, ${user}`;
    myPrompt.style.display = "none";

    // Notify the server of the new user
    socket.emit("join", user);
    console.log("User joined:", user); // debug
});

// Typing indicator
messageInput.addEventListener("input", () => {
  socket.emit("typing", name.value.trim());
});

// Prevent sending empty messages and send messages if not empty
sendMessageForm.addEventListener("submit", (e) => {
    
    // Prevent the default form submission behavior to handle it with JavaScript
    e.preventDefault();

    // Sanitize and trim the input value from the message input field
    const messageText = sanitizeInput(messageInput.value.trim());
    
    // Sanitize and trim the input value from the name input field
    const user = sanitizeInput(name.value.trim());

  // Check if the message text is empty after sanitization
    if (!messageText) {
        alert("Message cannot be empty.");
        return;
    }

    // Create an object to hold the message data with the user's name and message text
    const messageData = { name: user, message: messageText };

    // Emit the new message to the server
    socket.emit("sendMessage", messageData);
    console.log("Message sent:", messageData); // debug

    // Clear the input field
    messageInput.value = "";
    messageInput.focus(); // Automatically refocus the input field
});

// Update the online user list
socket.on("onlineUser", (users) => {

    // Get the container element that will display the online users
    const onlineUserContainer = document.getElementById("online-user");
    console.log("Online users updated:", users);

    // Clear the current content of the online user container
    onlineUserContainer.innerHTML = "";

    // Get the element that displays the count of online users
    const count = document.getElementById("count");

    // Update the text content of the count element to show the number of online users
    count.innerText = `Users Online (${users.length})`;

    users.forEach((user) => {
        // Assign profile image based on imageIndex logic
        if (!userImageMap.has(user.name)) {
            // Cycle images between 1.jpg to 4.jpg
            if (imageIndex > 4) imageIndex = 1;
            userImageMap.set(user.name, imageIndex++);
        }

        const assignedImageIndex = userImageMap.get(user.name);
        
        const userImage = assignedImageIndex
        ? `public/images/${assignedImageIndex}.jpg`
        : "public/images/default.jpg";

        
        const userDiv = document.createElement("div");
        
        userDiv.innerHTML = `
                <div class="user">
                    <img src="${userImage}" alt="User" />
                    <p>${user.name}</p>
                    <span class="online-dot"></span>
                    <p id="${user.id}" class="typing"></p>
        </div>`;
        
        onlineUserContainer.appendChild(userDiv);
        console.log('onlineUserConatainer',onlineUserContainer);
    });
});

// Display typing indicator
socket.on("typing", (userId) => {
  const typingElement = document.getElementById(userId);

  if (typingElement) {
    typingElement.innerText = "typing...";
    clearTimeout(typingElement._timeout); // Clear any previous timeout
    typingElement._timeout = setTimeout(() => {
      typingElement.innerText = "";
    }, 1000);
  }
});

// Display old messages to the new joinee
socket.on("joined", (oldMessages) => {
    
    const messageList = document.getElementById("message-list");
  
    if (!messageList) {
        console.error("Message list element not found!");
        return;
    }

    // Map to assign user images and cycle through them
    const userImageMap = new Map();
    let imageIndex = 1;

    oldMessages.forEach((msg) => {
        const msgDiv = document.createElement("div");

        // Assign an image if the user is not already in the map
        if (!userImageMap.has(msg.name)) {
            if (imageIndex > 4) imageIndex = 1;
            userImageMap.set(msg.name, imageIndex++);
        }

        const assignedImageIndex = userImageMap.get(msg.name);
        const userImage = assignedImageIndex
        ? `public/images/${assignedImageIndex}.jpg`
        : "public/images/default.jpg";

        msgDiv.innerHTML = `
                <div class="message-block">
                    <img src="${userImage}" alt="User Image" />
                    <div class="message-content">
                        <p class="name" style="margin-bottom: 15px;">${sanitizeInput(
                        msg.name
                        )}</p>
                        <p class="message">${sanitizeInput(msg.message)}</p>
                        <p class="timestamp">${msg.time}</p>
                    </div>
                </div>
        `;
        messageList.appendChild(msgDiv);
    });

    scrollToBottom();
});

// Display new messages
socket.on("newMessage", (newMessage) => {
    
    const messageList = document.getElementById("message-list");
    
    // Check if the message list element exists
    if (!messageList) {
        console.error("Message list element not found!");
        return;
    }
    
    // Determine if the message is sent by the current user
    const isUserMessage = newMessage.name === sanitizeInput(name.value.trim());
    
    // Set the user image based on whether the message is from the current user or others
    const userImage = isUserMessage
    ? "public/images/1.jpg" // Assuming "1.jpg" for the current user
    : "public/images/2.jpg"; // Default for other users

    // Create a new div element for the message block
    const msgDiv = document.createElement("div");

    // Add inner HTML structure for the message block
    msgDiv.innerHTML = `
        <div class="message-block${isUserMessage ? "-user" : ""}">
            <img src="${userImage}" alt="User Image" />
            <div class="message-content" style="${
                isUserMessage
                ? "background-color:rgb(151, 211, 159); color: black;"
                : ""
            }">
                <p class="name">${sanitizeInput(newMessage.name)}</p>
                <p class="message">${sanitizeInput(newMessage.message)}</p>
                <p class="timestamp">${newMessage.time}</p>
            </div>
        </div>
    `;
    // Append the new message div to the message list
    messageList.appendChild(msgDiv);

    // Scroll to the bottom of the message list to show the latest message
    scrollToBottom();
    
    // Play notification sound if the message is not from the current user
    if (!isUserMessage) {
        const notificationSound = new Audio("public/notifications/msgTune.mp3");
        notificationSound.play().catch((err) => console.error("Sound error:", err));
    }
});

function loadOldMessages() {
    const msgDiv = document.createElement("div");
    // const timestamp = new Date(msg.time);

    msgDiv.innerHTML = `
    <div class="message-block">
        <img src="${userImage}" alt="pic" />
        <div class="message-content">
            <p class="name" style="margin-bottom: 15px;">${msg.name}</p>
            <p class="message">${msg.message}</p>
            <p class="timestamp">${msg.time}</p>
        </div>
    </div>`;

    console.log("Message div created:", msgDiv); //debug
    
    messageList.appendChild(msgDiv);
    console.log("Updated message list content:", messageList.innerHTML); //debug
}