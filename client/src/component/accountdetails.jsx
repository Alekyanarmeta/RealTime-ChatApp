import Createaccount from "./createchat"
import { useState } from "react"
import axios from "axios"
function Accountdetails({ data }) {
    const userids = (data.users).map(user => user._id)
    console.log(data)
    console.log(userids)
    const [adduser, setadduser] = useState(false)
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("userinfo"))
    if (!token) {
        console.log("No token found");
        return;
    }
    const leavegroup = async (userId) => {
        try {
            const payload = { chatId: data._id, userId }
            const response = await axios.put("https://realtime-chatapp-fe5f.onrender.com/api/leavegroup", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            window.location.reload()
        }
        catch (err) {
            console.log("leavegroup error")
        }
    }
    return (
        <div className="bg-light w-50 mt-2  overflow-y-auto border rounded position-absolute " style={{ maxHeight: "60vh", cursor: "pointer", scrollbarWidth: "none", top: "15%", left: "30%" }}>
            <div className="ps-2 pt-2">
                <h5>Admin</h5>
                <img src={data.groupAdmin.pic} alt="pic" className="col-2" />
                <p>{data.groupAdmin.name}</p>
            </div>
            <div className="p-2 pt-2 ">
                <h5>Other members</h5>
                {
                    data.users.map(
                        (item) => data.groupAdmin._id !== item._id && (
                            <div className="d-flex">
                                <div>
                                    <img src={item.pic} alt="pic" className="col-2" />
                                    <p>{item.name}</p>
                                </div>
                                {user._id === item._id && (<p className="text-danger" onClick={() => leavegroup(item._id)}>leave group</p>)}
                                {(data.groupAdmin._id === user._id) && data.isGroupChat && (<div onClick={() => leavegroup(item._id)}>remove</div>)}
                            </div>

                        )
                    )
                }
            </div>
            {data.isGroupChat && (
                <p className="ps-2" style={{ color: 'rgba(156, 19, 19, 0.72)' }}>Exit group</p>)}
            {user._id === data.groupAdmin._id && data.isGroupChat && (<p className="ps-2 text-danger" style={{ cursor: "pointer" }} onClick={() => {
                setadduser(true)
            }}>Add mem</p>)}

            {

                adduser && (
                    <Createaccount
                        setadduser={setadduser}
                        chatId={data._id}
                        groupmembers={userids}
                    />
                )

            }
        </div>
    )
}

export default Accountdetails