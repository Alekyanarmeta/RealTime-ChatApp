import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import Accountdetails from "./accountdetails";
import socket from "../config/socket";
import { ChatState } from "../config/Context";

function Chatmesg({ data }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [typing, setTyping] = useState(false);
  const [chatName, setChatName] = useState("");

  const { notification, setNotification } = ChatState();

  const messageRef = useRef(null);
  const chatNameRef = useRef(null);

  const token = localStorage.getItem("token");

  /* ------------------ Sync chat name when chat changes ------------------ */
  useEffect(() => {
    if (data?.chatName) {
      setChatName(data.chatName);
    }
  }, [data]);

  /* ------------------ Fetch messages ------------------ */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/allmessages/${data._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      socket.emit("join chat", data._id);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data?._id) return;
    fetchMessages();
  }, [data]);

  /* ------------------ Socket listeners ------------------ */
  useEffect(() => {
    const messageHandler = (newMessage) => {
      if (!data || newMessage.chat._id !== data._id) {
        setNotification((prev) =>
          prev.some((n) => n._id === newMessage._id)
            ? prev
            : [newMessage, ...prev]
        );
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("message received", messageHandler);
    socket.on("typing", () => setTyping(true));
    socket.on("stop typing", () => setTyping(false));
    socket.on("chat renamed", (updatedchat) => {
      if (updatedchat._id === data._id) {
        setChatName(updatedchat.chatName)
      }
    });

    return () => {
      socket.off("message received", messageHandler);
      socket.off("typing");
      socket.off("stop typing");
      socket.off("chat renamed");
    };
  });

  /* ------------------ Send message ------------------ */
  const sendNewMessage = async () => {
    if (!messageRef.current.value.trim()) return;

    socket.emit("stop typing", data._id);
    const content = messageRef.current.value;
    messageRef.current.value = "";

    try {
      const res = await axios.post(
        "http://localhost:8080/api/sendmessage",
        { chatId: data._id, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("new message", res.data);
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ Typing indicator ------------------ */
  const typeHandler = () => {
    socket.emit("typing", data._id);

    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      let timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= 3000) {
        socket.emit("stop typing", data._id);
      }
    }, 3000);
  };

  /* ------------------ Rename chat ------------------ */
  const renameChat = async () => {
    if (!chatNameRef.current.value.trim()) return;

    try {
      const res = await axios.put(
        "http://localhost:8080/api/rename",
        {
          chatId: data._id,
          chatName: chatNameRef.current.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditMode(false);
      setChatName(res.data.chatName)
      socket.emit("rename", res.data);
    } catch (err) {
      console.error("rename error", err);
    }
  };

  if (!data) {
    return <div className="m-auto text-muted">Click on user to start chat</div>;
  }

  return (
    <div className="h-100 d-flex flex-column">
      {/* Header */}
      <div className="d-flex justify-content-center p-2">
        <div className="bg-success text-white rounded px-3 py-2 d-flex gap-3 align-items-center">
          {editMode ? (
            <>
              <input ref={chatNameRef} defaultValue={chatName} />
              <img
                src="/correct.png"
                style={{ width: 20, cursor: "pointer" }}
                onClick={renameChat}
              />
            </>
          ) : (
            <>
              <span onClick={() => setShowDetails((p) => !p)}>
                {chatName}
              </span>
              <img
                src="/edit.png"
                style={{ width: 15, cursor: "pointer" }}
                onClick={() => setEditMode(true)}
              />
            </>
          )}
        </div>
      </div>

      {showDetails && <Accountdetails data={data} />}

      {/* Messages */}
      <div
        className="flex-grow-1 overflow-y-auto p-2 bg-primary"
        style={{ maxHeight: "70vh" }}
      >
        {loading ? "Loading..." : <ScrollableChat messages={messages} />}

        {typing && (
          <div className="ms-2">
            <div className="spinner-grow spinner-grow-sm text-light" />
            <div className="spinner-grow spinner-grow-sm text-light ms-1" />
            <div className="spinner-grow spinner-grow-sm text-light ms-1" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-top p-2 d-flex gap-2">
        <input
          ref={messageRef}
          className="form-control"
          onChange={typeHandler}
          onKeyDown={(e) => e.key === "Enter" && sendNewMessage()}
        />
        <button className="btn btn-primary" onClick={sendNewMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatmesg;
