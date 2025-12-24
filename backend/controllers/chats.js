const router = require("express").Router();

const chatSchema = require("../models/Chatmodel");

const Authentication = require("./authentication");

router.post("/creategroup", async (req, res) => {
  try {
    const { chatName, isGroupChat, users, groupAdmin } = req.body;
    console.log(users)
    console.log(chatName, isGroupChat, users, groupAdmin);
    const chat = await chatSchema.create({
      chatName,
      isGroupChat,
      users,
      groupAdmin,
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error creating chat", error: err });
  }
});

router.put("/rename", Authentication, async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await chatSchema.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    );
    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json(updatedChat);
  } catch (err) {
    res.status(500).json({ message: "Error renaming chat", error: err });
  }
});

router.put("/groupadd", Authentication, async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await chatSchema.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    );
    if (!added) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(added);
  } catch (err) {
    res.status(500).json({ message: "Error adding to group", error: err });
  }
});

router.put("/leavegroup", Authentication, async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const removed = await chatSchema.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    );
    if (!removed) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json(removed);
  } catch (err) {
    res.status(500).json({ message: "Error removing from group", error: err });
  }
});

router.get("/fetchchats", Authentication, async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(userId)

    if (!userId) {
      return res.status(400).json({ message: "User id missing" });
    }


    const chats = await chatSchema
      .find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error in /fetchchats:", err);
    res.status(500).json({ message: "Error fetching chats", error: err });
  }
});
module.exports = router;
