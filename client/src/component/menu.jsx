import { useState } from "react";
import Createaccount from "./createchat";
import Profilesettings from "./profile";

function Menu() {
    const [Component, setComponent] = useState(null);
    console.log(Component)

  return (
    <div className="d-flex align-items-center">
      <div className="bg-light p-2 rounded-2 mt-3 me-2 col-6 col-md-3 shadow text-center">
        <hr />

              <p className="mb-1 border border-dark border-2 p-2"
                  style={{cursor:"pointer"}}
                  onClick={() => {
            
                      console.log("profile setting")
                      setComponent("Profile")
                  }}
        >
          Profile Settings
        </p>

        

        <p className="mb-1 border border-dark border-2 p-2">Logout</p>
      </div>

      <div className="mt-3 me-2 text-dark">
        {Component == "Profile" && (<Profilesettings />)}
        
      </div>
    </div>
  );
}

export default Menu;
