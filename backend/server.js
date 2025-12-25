const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const userroute = require("./controllers/user");
const chatroute = require("./controllers/chats");
const mesgroute = require("./controllers/message");

dotenv.config();

// ============================
// REQUIRED FOR RENDER
// ============================
app.set("trust proxy", 1);

// ============================
// CORS CONFIG
// ============================
const allowedOrigins = [
  "http://localhost:5173",
  "https://sparkly-fox-4d5d71.netlify.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".netlify.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// ============================
// MIDDLEWARE
// ============================
app.use(express.json());

// ============================
// ROUTES
// ============================
app.use("/api", userroute);
app.use("/api", chatroute);
app.use("/api", mesgroute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ============================
// DATABASE
// ============================
mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// ============================
// SOCKET.IO
// ============================
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        origin === "http://localhost:5173" ||
        origin.endsWith(".netlify.app")
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("setup", (user) => {
    socket.join(user._id);
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.to(user._id).emit("message received", newMessage);
    });
  });

  socket.on("typing", (chatId) => socket.in(chatId).emit("typing"));
  socket.on("stop typing", (chatId) => socket.in(chatId).emit("stop typing"));

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
