import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

interface RegionLocation {
  x: number;
  y: number;
}

type Data = RegionLocation[];

type Message = {
  data: Data;
};

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client URL
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const idToRooms = new Map();

io.on("connection", (socket: Socket) => {
  idToRooms.set(socket.id, new Set());
  console.log(`User Socket ID ${socket.id} registered.`);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("ur", msg => {
    const roomsJoined = idToRooms.get(socket.id);
    const roomsToJoin = msg.data.map((point: any) => `${point.x}-${point.y}`);
    if (roomsJoined) {
      roomsJoined.forEach((roomName: string) => {
        socket.leave(roomName);
      });
    }
    roomsJoined.clear();

    roomsToJoin.forEach((roomName: string) => {
      socket.join(roomName);
      roomsJoined.add(roomName);
    });
    console.log(roomsJoined);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
