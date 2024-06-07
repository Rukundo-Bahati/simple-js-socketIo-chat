import express from "express";
import { createServer } from "http";
import path, { dirname } from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const server = createServer(app); // Create server instance
const io = new Server(server);

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {
  socket.on("new user", (username) => {
    io.emit("update", `${username} joined the conversation`); // Broadcast to all clients
  });
  socket.on("exit user", (username) => {
    io.emit("update", `${username} left the conversation`); // Broadcast to all clients
  });
  socket.on("chat", (message) => {
    io.emit("chat", message); // Broadcast chat message to all clients
  });
});

server.listen(3420, () => console.log(`Server is running on port 3420`));
