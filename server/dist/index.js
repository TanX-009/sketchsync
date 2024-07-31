import express from "express";
import { createServer } from "http";
import { Server } from "../node_modules/socket.io/dist/index";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
app.get("/", (req, res) => {
    res.send("Socket.IO server is running");
});
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on("message", (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);
        socket.emit("response", `Received your message: ${msg}`);
    });
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
