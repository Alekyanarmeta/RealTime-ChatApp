const router = require("express").Router();

const Authentication = require("./authentication")

const Message = require("../models/Messagemodel")
const User = require("../models/Usermodel")
const Chat = require("../models/Chatmodel")
router.post("/sendmessage", Authentication, async (req, res) => {
    try {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            return res.status(400).json({ message: "Invalid data" });
        }
        console.log("user", req.user)
        let message = await Message.create({
            sender: req.user.id,
            content,
            chat: chatId,
        });


        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        })
        res.status(201).json(message);
    } catch (err) {
        console.error("send message error", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/allmessages/:chatId", Authentication, async (req, res) => {
    try {
        console.log(req.params.chatId)
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic")
        console.log(messages)
        console.log("message")
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router

