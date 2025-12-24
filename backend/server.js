const express = require("express");
const app = express();
const port = 3000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userroute = require("./controllers/user");
const cors = require("cors");
const chatroute = require("./controllers/chats");
const mesgroute = require("./controllers/message")
const http = require("http");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
dotenv.config();

const PORT = process.env.PORT || port;

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());
app.use("/api", userroute);
app.use("/api", chatroute);
app.use("/api", mesgroute);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

// socket logic
io.on("connection", (socket) => {
  console.log("client connected:", socket.id);


  socket.on("setup", (userdata) => {
    socket.join(userdata._id);
    console.log("joined user:", userdata._id);
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log("joined chat:", chatId);
  });

  socket.on("new message", (newmessage) => {
    var chat = newmessage.chat

    console.log(newmessage.chat)
    if (!chat.users) return console.log("user not found")
    chat.users.forEach((user) => {
      if (user._id == newmessage.sender._id) return console.log(user.name)

      socket.in(user._id).emit("message received", newmessage)
    })
  })

  socket.on("typing", (chatId) => {
    socket.in(chatId).emit("typing")
  })
  socket.on("stop typing", (chatId) => {
    socket.in(chatId).emit("stop typing")
  })

  socket.on("rename", (chat) => {
    console.log("rename", chat)
    socket.in(chat._id).emit("chat renamed", (chat))
  })
  socket.on("disconnect", () => {
    console.log(" client disconnected");
  });
});

// ✅ LISTEN USING server.listen
server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});