import { useState, useRef } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { createContext } from "react";


export const context = createContext()
function Homepage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat");
    }
  }, []);
  const [show, setShow] = useState(true);

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const pic = useRef(null);

  const createaccount = async () => {
    try {
      const nameVal = name.current?.value?.trim();
      const emailVal = email.current?.value?.trim();
      const passwordVal = password.current?.value;

      if (!nameVal || !emailVal || !passwordVal) {
        alert("Please fill in name, email and password to sign up.");
        return;
      }

      const payload = { name: nameVal, email: emailVal, password: passwordVal, pic: pic.current.value };

      const response = await axios.post(
        "https://realtime-chatapp-fe5f.onrender.com/api/signin",
        payload
      );
      if (name.current) name.current.value = "";
      if (email.current) email.current.value = "";
      if (password.current) password.current.value = "";
      if (pic.current) pic.current.value = "";

      console.log("account created", response.data);
      alert(response.data?.message || "Account created");
      setShow(false);
    } catch (err) {
      console.log("error in creating account", err);
      alert(
        err?.response?.data?.message || err.message || "Error creating account"
      );
    }
  };

  const Logintoaccount = async () => {
    try {
      const payload = {
        email: email.current.value,
        password: password.current.value,
      };
      const response = await axios.post(
        "https://realtime-chatapp-fe5f.onrender.com/api/login",
        payload
      );

      email.current.value = "";
      password.current.value = "";
      console.log("response from login", response.data);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userinfo", JSON.stringify(response.data.userinfo));
      }
      console.log("logged in", response.data);
      alert(response.data?.message || "Login successful");

      navigate("/chat")

    } catch (err) {
      console.log("error in login", err);
      alert(err?.response?.data?.message || err.message || "Error logging in");
    }
  };

  return (
    <div className="App d-flex flex-column gap-4">
      {show ? (
        <>
          <div className="bg-white opacity-75 rounded-2 p-2">Sign Up</div>
          <div className="bg-white opacity-75 d-flex flex-column p-4 rounded-2 gap-2 justify-content-center ">
            <label>Enter Name</label>
            <input type="text" placeholder="Enter the Name" ref={name} />
            <label>Enter Email</label>
            <input type="text" placeholder="Enter the Email" ref={email} />
            <label>Enter Password</label>
            <input
              type="password"
              placeholder="Enter the password"
              ref={password}
            />
            <label>Upload Pic</label>
            <input type="image" ref={pic} />
            <button
              className="btn btn-success mt-4 w-50"
              style={{ marginLeft: "25%" }}
              onClick={() => createaccount()}
            >
              Sign Up
            </button>
            <div className="d-flex gap-2 align-items-center justify-content-center mt-3 ">
              <p>have account</p>
              <p
                className="text-primary"
                onClick={() => setShow(false)}
                style={{ cursor: "pointer" }}
              >
                Login
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white opacity-75 rounded-2 p-2">Login Form</div>
          <div className="bg-white opacity-75 d-flex flex-column p-4 rounded-2 gap-2 justify-content-center  ">
            <label>Enter Email</label>
            <input type="email" placeholder="Enter the Email" ref={email} />
            <label>Enter Password</label>
            <input
              type="password"
              placeholder="Enter the password"
              ref={password}
            />
            <button
              className="btn btn-success mt-4 w-50"
              style={{ marginLeft: "25%" }}
              onClick={() => Logintoaccount()}
            >
              Login
            </button>
            <div className="d-flex gap-2 align-items-center justify-content-center mt-3 ">
              <p>Create an account</p>
              <p
                className="text-primary"
                onClick={() => setShow(true)}
                style={{ cursor: "pointer" }}
              >
                SignIn
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Homepage;
