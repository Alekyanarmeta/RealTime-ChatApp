import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogic.js";

function ScrollableChat({ messages }) {
    const user = JSON.parse(localStorage.getItem("userinfo"));

    console.log(messages)
    console.log(user)

    return (
        <>
            {messages &&
                messages.map((m, i) => {

                    console.log("senderid", m.sender._id)
                    console.log("userid", user._id)
                    const isMe = String(m.sender?._id) === String(user._id);

                    const showAvatar =
                        isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id);

                    return (
                        <div
                            key={m._id}
                            className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"
                                }`}
                        >

                            {!isMe && showAvatar && (
                                <img
                                    src={m.sender?.pic}
                                    alt={m.sender?.name}
                                    title={m.sender?.name}
                                    className="rounded-circle me-2"
                                    style={{ width: 35, height: 35 }}
                                />
                            )}


                            <span
                                style={{
                                    backgroundColor: isMe
                                        ? "rgba(252,252,188,1)"
                                        : "rgba(219,249,219,1)",
                                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                    borderRadius: "20px",
                                    padding: "8px 14px",
                                    maxWidth: "75%",
                                    display: "inline-block",
                                }}
                            >
                                {m.content}
                            </span>
                        </div>
                    );
                })}
        </>
    );
}

export default ScrollableChat;
