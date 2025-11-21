import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Chat from './chatter.schema.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
export const server = http.createServer(app);

app.use(express.json());
app.use(cors());

// serve static frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Initialize Socket.IO server with custom configurations
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

// Array to store online users
let onlineUser = [];

// Event handling for Socket.IO connections
io.on("connection", (socket) => {
    console.log("Connection Made ");

    // Event: User joins
    socket.on("join", async (name) => {
        console.log("name before joining: ", name);
        if(!name || name.trim().length === 0){
            return; // validation
        }
        try {
            const oldMessage = await Chat.find();
            console.log("Fetched old messages:", oldMessage); // Debugging log
            // Add the new user to the list
            onlineUser.push({ id: socket.id, name: name.trim() });
            console.log("Current online users:", onlineUser);
            // Notify everyone of the updated user list
            io.emit("onlineUser", onlineUser);
            // Send old messages only to the joining user
            socket.emit("joined", oldMessage);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    });

    // Event: User typing
    socket.on('typing', () => {
        io.emit('typing', socket.id);
    });

    // Event: User sends a message
    socket.on("sendMessage", async (newMessage) => {
        // console.log("newMessage: ", newMessage); //debug
        try {
            // Validate the incoming message
            if (!newMessage.message?.trim() || !newMessage.name?.trim()) {
                return socket.emit("error", { message: "Name and message are required." });
            }

            // Create a new chat message
            const {name, message} = newMessage;
            console.log("name and message",name,message);
            
            const date = new Date();
            const hours = date.getHours(); // Get the hours
            const minutes = date.getMinutes(); // Get the minutes
            
            // Format to ensure two digits for minutes
            const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;

            const newUser = new Chat({
                // name: newMessage.name.trim(),
                // message: newMessage.message.trim(),
                name: name,
                message: message,
                time: formattedTime,
            });
            console.log('newUser details: ', newUser); // debug

            // Save the message to the database
            const savedMessage = await newUser.save();

            // Broadcast the saved message to all connected clients
            io.emit("newMessage", savedMessage);
        }
        catch (error) {
            console.error("Error in 'sendMessage' event:", error);
            socket.emit("error", { message: "Failed to send message." });
        }
    });

    // Event: User disconnects
    socket.on("disconnect", () => {
        const indexToRemove = onlineUser.findIndex(user => user.id == socket.id);
        onlineUser.splice(indexToRemove, 1);
        io.emit('onlineUser', onlineUser);
        console.log("Connection disconnected.");
    });
});
