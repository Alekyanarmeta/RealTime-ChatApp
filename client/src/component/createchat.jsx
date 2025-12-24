import axios from "axios";
import "../App.css"
import { useEffect, useRef, useState } from "react";

function Createaccount({ setadduser, groupmembers, chatId }) {

  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found");
    return;
  }

  const [Allaccounts, searchAccount] = useState(null)

  const [addusers, setaddusers] = useState(null)

  const chatName = useRef(null)
  const Namestartwith = async (name) => {
    try {

      if (!name) {
        searchAccount(null)
      }
      else {
        const response = await axios.get("http://localhost:8080/api/allusers",
          {
            params: { search: name }
          }

        )

        searchAccount(response.data)
      }


    } catch (err) {
      console.log("searching error")
    }
  }

  const createChat = async (data) => {
    try {
      const payload = data
      const response = await axios.post("http://localhost:8080/api/creategroup", payload)
      if (response.data.message === "already chat created") {
        alert("already chat created")
      }
      window.location.reload(true)
    } catch (err) {
      console.log("create chat error")
    }
  }

  const Adduser = async (userId) => {
    try {

      const exists = groupmembers.some(u => u === userId);

      if (exists) {
        alert("User already in group");
        return;
      }
      const payload = { chatId, userId }
      const response = await axios.put(
        "http://localhost:8080/api/groupadd",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setadduser(false)
      window.location.reload()

    }
    catch (err) {
      console.log("addusers error")
    }
  }
  return (
    <>
      <input
        type="search"
        placeholder="Search Accounts"
        className="w-100 w-md-50 bg-dark mb-2 p-2 rounded-2 border"
        onChange={(e) => Namestartwith(e.target.value)}
      />
      <div className="d-flex flex-wrap gap-3 align-items-center">
        <div className="d-flex flex-grow-1 gap-3 align-items-center">
          {!chatId && addusers?.length > 1 && (
            <input
              type="text"
              placeholder="Create group name"
              className="form-control flex-grow-1"
              ref={chatName}
            />
          )}

          {!chatId && addusers?.length > 0 && (
            <button
              className="btn btn-primary flex-shrink-0"
              style={{ height: "38px" }}
              onClick={() => {

                const user = JSON.parse(localStorage.getItem("userinfo"))

                if (addusers.length > 1 && chatName.current.value) {
                  createChat({ chatName: chatName.current.value, isGroupChat: true, users: [user._id, ...addusers.map((item) => item.id)], groupAdmin: user._id })
                }
                else if (addusers.length == 1) {

                  createChat({ chatName: addusers[0].name, isGroupChat: false, users: [user._id, addusers[0].id], groupAdmin: user._id })
                }
                setaddusers(null)
              }}
            >
              Create chat
            </button>
          )}
        </div>

        {!chatId && addusers?.length > 0 && (
          <div
            className="overflow-y-auto d-flex flex-wrap "
            style={{ maxHeight: "20vh" }}
          >
            {addusers.map(item => (
              <div className="d-flex">
                <div
                  key={item.id}
                  className="d-flex flex-column align-items-center justify-content-center"
                  style={{ minWidth: "160px" }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="rounded-circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "cover"
                    }}
                  />
                  <p className="mb-0 text-break">{item.name}</p>
                </div>
                <button
                  className="border-0 bg-transparent fs-5 "
                  onClick={() =>
                    setaddusers(prev => prev.filter(u => u.id !== item.id))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}



      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "45vh", scrollbarWidth: "none" }}>

        {Allaccounts &&
          Allaccounts.map((item) => (
            <div key={item._id} className="d-flex gap-2 mb-2 align-items-center search" style={{ cursor: "pointer" }} onClick={() => {
              if (!chatId) {
                if (!addusers) {
                  setaddusers([{ img: item.pic, name: item.name, id: item._id }])
                }
                else {
                  const exists = addusers.some(user => user.id === item._id);



                  if (!exists) {
                    setaddusers([
                      ...addusers,
                      { img: item.pic, name: item.name, id: item._id }
                    ]);
                  }
                }
              }
              else {
                Adduser(item._id)
              }
            }}>
              <img src={item.pic} alt="pic" className="col-2 col-md-1 rounded-5" />
              <p className="text-dark">{item.name}</p>
            </div>
          ))}

      </div>
    </>
  )
}

export default Createaccount;
