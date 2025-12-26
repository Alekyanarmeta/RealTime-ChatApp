import axios from "axios";
import { useEffect, useState } from "react";
import Chatmesg from "./chatmesg";
function Allchats({ setSelectedChat }) {

  const [chats, setchats] = useState(null)



  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await axios.get(
          "https://realtime-chatapp-fe5f.onrender.com/api/fetchchats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setchats(response.data)

      } catch (err) {
        console.log(
          "Error in fetching chats:",
          err.response?.data || err.message
        );
      }
    };

    fetchChats();
  }, []);

  return (
    <div >
      <input
        type="search"
        placeholder="Search chats"
        className="w-100 mb-2 p-2 rounded-2 border"
      />
      <div className="overflow-y-auto " style={{ maxHeight: "100vh", scrollbarWidth: "none" }}>
        {
          chats && chats.map(
            (item) => (

              <div key={item._id} className="border rounded ps-2 bg-white mb-2"
                onClick={() => {
                  setSelectedChat(item)

                }}>
                <p>{item.chatName}</p>
                {item.latestMessage && <div style={{ color: 'rgb(100,100,120)' }}>
                  {item.latestMessage.content}
                </div>}
              </div>
            )
          )
        }
      </div>
    </div>
  );
}

export default Allchats;
