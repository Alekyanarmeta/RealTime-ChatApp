import { io } from "socket.io-client";

const socket = io("https://realtime-chatapp-fe5f.onrender.com/", {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true
});

export default socket;
