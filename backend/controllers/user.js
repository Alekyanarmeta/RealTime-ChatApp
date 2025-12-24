const router = require("express").Router();

const User = require("../models/Usermodel");

const Authentication = require("./authentication");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

router.post("/signin", async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;


    const existinguser = await User.findOne({ email: email });
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedpassword,
      pic,
    });

    res.status(201).json({ message: "signin successfull" });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;



    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const ispasswordcorrect = await bcrypt.compare(password, user.password);
    if (!ispasswordcorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const jsonwebtoken = await jwt.sign(
      { id: user._id, email: email, password: password },
      process.env.Token_Secret,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      userinfo: user,
      token: jsonwebtoken,
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

router.get("/allusers", async (req, res) => {
  try {
    const search = req.query.search;
    const searchcondition = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const users = await User.find(searchcondition).select("-password");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

module.exports = router;
