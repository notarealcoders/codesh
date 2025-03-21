const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const httpServer = createServer((req, res) => {
      handle(req, res);
    });

    const io = new Server(httpServer, {
      cors: {
        origin: "https://codesh.onrender.com/",
        methods: ["GET", "POST"],
      },
    });

    const rooms = new Map();
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join-snippet", ({ snippetId, userName }) => {
        socket.join(snippetId);
        console.log(
          `User ${socket.id} (${userName}) joined snippet ${snippetId}`
        );

        if (!rooms.has(snippetId)) rooms.set(snippetId, new Map());
        const userColor = colors[Math.floor(Math.random() * colors.length)];
        rooms.get(snippetId).set(socket.id, {
          name: userName || `User_${socket.id.slice(0, 5)}`,
          color: userColor,
          typing: false,
        });

        io.to(snippetId).emit(
          "users-updated",
          Array.from(rooms.get(snippetId).entries())
        );
      });

      socket.on("code-update", ({ snippetId, code }) => {
        socket.to(snippetId).emit("code-updated", code);
      });

      socket.on("cursor-update", ({ snippetId, position }) => {
        socket
          .to(snippetId)
          .emit("cursor-updated", { userId: socket.id, position });
      });

      socket.on("typing", ({ snippetId, isTyping }) => {
        if (rooms.has(snippetId) && rooms.get(snippetId).has(socket.id)) {
          rooms.get(snippetId).get(socket.id).typing = isTyping;
          io.to(snippetId).emit("typing-updated", {
            userId: socket.id,
            isTyping,
          });
        }
      });

      socket.on("send-message", ({ snippetId, message }) => {
        io.to(snippetId).emit("message-received", {
          userId: socket.id,
          message,
          timestamp: Date.now(),
        });
      });

      socket.on("save-version", async ({ snippetId, code }) => {
        const response = await fetch(
          `http://localhost:3000/api/snippets/${snippetId}/versions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );
        const version = await response.json();
        io.to(snippetId).emit("version-saved", version);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (const [snippetId, users] of rooms) {
          if (users.has(socket.id)) {
            users.delete(socket.id);
            io.to(snippetId).emit("users-updated", Array.from(users.entries()));
            if (users.size === 0) rooms.delete(snippetId);
            break;
          }
        }
      });
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
