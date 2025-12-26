import { useState } from "react";
import Allchats from "./allchats";
import Chatmesg from "./chatmesg";
import Menu from "./menu";
import Createchat from "./createchat";
import socket from "../config/socket.js";
import { useEffect } from "react";
import { ChatState } from "../config/Context.jsx";
import { useNavigate } from "react-router-dom";
import "../App.css"
function Chatpage() {
  const { notification, setNotification } = ChatState()
  const [notificationchat, setnotificationchat] = useState(false)
  const [userprofile, setuserprofile] = useState(false)
  const navigate = useNavigate()

  console.log("notification", notification)

  const user = JSON.parse(localStorage.getItem("userinfo"))

  console.log(user)
  const [menuOpen, setMenuOpen] = useState(false);
  const [opencreateaccount, setcreateaccount] = useState(false);

  const [selectedChat, setSelectedChat] = useState(null);
  const showOverlay = menuOpen || opencreateaccount;

  const headcomponent = menuOpen || opencreateaccount || notificationchat || userprofile

  useEffect(() => {
    socket.connect();

    socket.emit("setup", user);



    return () => {
      socket.off("connected");
      socket.disconnect();
    };
  }, []);
  return (
    <div className="chat w-100 min-vh-100 m-3 d-flex flex-column position-relative" style={{ backgroundImage: "url(/image.png)" }}>


      <div className="ms-2 d-flex justify-content-between align-items-center">
        <img
          src="/setting.png"
          alt="settings"
          width={30}
          height={30}
          onClick={() => setMenuOpen(prev => !prev)}
          style={{ cursor: "pointer" }}
        />

        <div className="gap-5 d-flex me-5 align-items-center">
          <div className="position-relative d-inline-block">
            <img
              src="/notification.png"
              alt="notification"
              style={{ width: "20px", height: "20px" }}
              onClick={() => setnotificationchat(prev => !prev)}
            />

            {notificationchat && notification.length > 0 && (<div className="bg-primary position-absolute border border-dark " style={{ top: "25px", right: "25px" }}>
              {
                notification.map(
                  (item) => (
                    <div
                      key={item.chat._id}
                      onClick={() => {
                        setSelectedChat(item.chat);
                        setNotification((prev) =>
                          prev.filter((n) => n.chat._id !== item.chat._id)
                        );
                      }}
                    >
                      <p className="mb-0 p-0">New message from {item.chat.isGroupchat ? item.chat.chatName : item.sender.name}</p>
                      <hr className="m-0 p-0" />
                    </div>
                  )
                )
              }
            </div>)}

            {notification.length > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px" }}
              >
                {notification.length}
              </span>
            )}
          </div>
          <p
            className="mb-0"
            onClick={() => setcreateaccount(prev => !prev)}
            style={{ cursor: "pointer" }}
          >
            Create chat
          </p>
          <img src={user.pic} className="mb-0 border rounded-circle" style={{ width: "35px", height: "35px" }} onClick={() => setuserprofile(prev => !prev)} />
          {userprofile && (<div className="bg-light col-5 col-md-3 profile d-flex flex-column justify-content-center align-items-center p-5 pt-3 rounded-3" >
            <div >
              <img src={user.pic} className="rounded-circle" style={{ width: "60px", height: "60px" }} />
            </div>
            <div>
              <p>username: {user.name}</p>
              <p>email: {user.email}</p>
            </div>
          </div>)}
        </div>
      </div>


      {menuOpen && (
        <div className="position-absolute ms-5 col-6 ">
          <Menu />
        </div>
      )}



      {opencreateaccount && (
        <div
          className="position-fixed start-50 translate-middle z-3"
          style={{ width: "90%", maxWidth: "450px", top: "50%" }}
        >
          <div
            className="bg-white rounded-3 shadow p-3"
            style={{ maxHeight: "70vh", display: "flex", flexDirection: "column" }}
            onClick={e => e.stopPropagation()} // prevent close on click inside
          >
            <Createchat />
          </div>
        </div>

      )}

      {/* Overlay */}
      {showOverlay && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100"

          onClick={() => {
            setMenuOpen(false);
            setcreateaccount(false);
          }}
        />
      )}

      {/* Chat Section */}
      <div className={`d-flex flex-grow-1 ${headcomponent ? "opacity-3" : ""}`}>

        <div
          className={`col-4 col-md-3 m-2 me-0 p-2 rounded-2 ${selectedChat ? "allchats1" : "allchats"}`}
          style={{ backgroundColor: 'rgba(49, 61, 68, 0.31)' }}>
          <Allchats setSelectedChat={setSelectedChat} />
        </div>

        <div className={`bg-light m-2 p-2 rounded-2 chatmesg  ${selectedChat ? "flex-grow-1" : "chatmesg1"} `} >
          <Chatmesg data={selectedChat} setSelectedChat={setSelectedChat} />
        </div>
      </div>
    </div>
  );
}

export default Chatpage;
