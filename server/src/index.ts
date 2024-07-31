import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { checkDatabase } from "./pgp";

const app = express();
app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.10:3000"], // Allow only your frontend to access the server
    methods: ["GET", "POST"],
  },
});
let roomsData = {} as any;

io.on("connection", async (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    // Send existing interaction data for the room
    if (roomsData[room]) {
      socket.emit("history", roomsData[room]);
    } else {
      roomsData[room] = [];
      socket.emit("history", []);
    }

    // Store the room name in the socket object
    (socket as any).room = room;
  });

  socket.on("action", (data) => {
    socket.broadcast.to(data.roomCode).emit("action", data);
    if (roomsData[data.roomCode] === undefined) roomsData[data.roomCode] = [];
    roomsData[data.roomCode].push(data);
  });

  socket.on("update", (data) => {
    socket.broadcast.to(data.roomCode).emit("update", data);
    if (roomsData[data.roomCode] === undefined) roomsData[data.roomCode] = [];
    roomsData[data.roomCode] = data;
  });

  socket.on("cursorMove", (location) => {
    socket.broadcast.to((socket as any).room).emit("cursorMove", location);
  });

  socket.on("disconnect", () => {
    const room = (socket as any).room;
    console.log("A user disconnected");

    // Check if the room is empty
    if (room && !io.sockets.adapter.rooms.get(room)?.size) {
      console.log(`Room ${room} is now empty. Deleting room data.`);
      delete roomsData[room];
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
