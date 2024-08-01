import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import { renameSync } from "fs";
import path from "path";
import cleanUploads from "./utils/cleanUploads";
import generateTimestamp from "./utils/generateTimeStamp";

const app = express();
app.use(cors()); // Enable CORS for all routes

const upload = multer({
	dest: "public/uploads/",
	limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Serve static files
app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000", "http://192.168.1.10:3000"], // Allow only your frontend to access the server
		methods: ["GET", "POST"],
	},
});

// █▀ █▀█ █▀▀ █▄▀ █▀▀ ▀█▀ █▀
// ▄█ █▄█ █▄▄ █░█ ██▄ ░█░ ▄█
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

	socket.on("action_CtoS", (data) => {
		socket.broadcast.to(data.roomCode).emit("action_StoC", data);
		if (roomsData[data.roomCode] === undefined) roomsData[data.roomCode] = [];
		roomsData[data.roomCode].push(data);
	});

	socket.on("update", (data) => {
		const room = (socket as any).room;
		socket.broadcast.to(room).emit("update", data);
		if (roomsData[room] === undefined) roomsData[data.roomCode] = [];
		roomsData[room] = data;
	});

	socket.on("cursorMove", (location) => {
		socket.broadcast.to((socket as any).room).emit("cursorMove", location);
	});

	socket.on("disconnect", () => {
		const room = (socket as any).room;
		console.log("A user disconnected from room:", room);

		// Check if the room is empty
		if (room && !io.sockets.adapter.rooms.get(room)?.size) {
			console.log(`Room ${room} is now empty. Deleting room data.`);
			cleanUploads(room);
			delete roomsData[room];
		}
	});
});

// █▀▄▀█ █▀▀ ▀█▀ █░█ █▀█ █▀▄ █▀
// █░▀░█ ██▄ ░█░ █▀█ █▄█ █▄▀ ▄█

app.post("/upload", upload.single("image"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	const imageName = `${req.body.roomCode}_${req.file.filename}_${generateTimestamp()}`;
	const imageUrl = `/uploads/${imageName}`;
	renameSync(req.file.path, path.join("public/uploads", imageName));

	res.json({ url: imageUrl });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
