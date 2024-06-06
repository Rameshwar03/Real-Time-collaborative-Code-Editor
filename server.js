const express = require("express");
const { Server } = require("socket.io");
const PORT = 5000;
const app = express();
const path = require("path");
const http = require("http");
const ACTIONS = require("./src/Actions");
// const execute = require("./script.mjs");

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("build"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMap = {};

function getAllConnectedClients(id) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(id) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    };
  });
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  // broadcasting while user join the room
  socket.on(ACTIONS.JOIN, ({ id, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(id);
    const clients = getAllConnectedClients(id);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Code change event
  socket.on(ACTIONS.CODE_CHANGE, ({ id, code }) => {
    socket.in(id).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Broadcating while user is disconnecting
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((id) => {
      socket.in(id).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
