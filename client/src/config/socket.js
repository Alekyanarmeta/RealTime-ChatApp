import { io } from "socket.io-client"

const socket = io("https://realtime-chatapp-fe5f.onrender.com")

export default socket