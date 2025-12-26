import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profilesettings from "./profile";

function Menu() {
  const [component, setComponent] = useState(null);
  const navigate = useNavigate();


  const handleLogout = () => {
    console.log("token", localStorage.getItem("token"))
    localStorage.clear()
    navigate("/");

  };



  return (
    <div className="d-flex align-items-center">

      <div className="bg-light p-2 rounded-2 mt-3 me-2 col-6 col-md-3 shadow text-center">
        <hr />

        <p
          className="mb-1 border border-dark border-2 p-2"
          style={{ cursor: "pointer" }}
          onClick={() => setComponent("Profile")}
        >
          Profile Settings
        </p>

        <p
          className="mb-1 border border-dark border-2 p-2"
          onClick={(e) => {
            localStorage.clear()
            navigate("/")
          }}
        >
          Logout
        </p>

      </div>

      <div className="mt-3 me-2 text-dark">
        {component === "Profile" && <Profilesettings />}
      </div>
    </div>
  );
}

export default Menu;
