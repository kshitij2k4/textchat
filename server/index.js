const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // For development, allow all origins
    methods: ["GET", "POST"]
  }
});

const users = {}; // socket.id -> username

io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);


  // Handle setting username
  socket.on("setUsername", (username) => {
    users[socket.id] = username;
    io.emit("users", Object.values(users)); // broadcast updated user list
  });

  socket.on("sendMessage", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    delete users[socket.id];
    io.emit("users", Object.values(users));
  });
});


// Start the server
server.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://192.168.29.109:5000");
});