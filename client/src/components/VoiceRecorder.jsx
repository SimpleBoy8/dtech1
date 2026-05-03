import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../services/api";

const socket = io("http://localhost:5000");

function ChatBox() {
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = 1; // set your admin user id
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    socket.emit("joinRoom", user.id);

    fetchMessages();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const fetchMessages = async () => {
    const res = await API.get(`/chat/${user.id}/${adminId}`);
    setMessages(res.data);
  };

  const sendText = async () => {
    if (!text.trim()) return;

    const msg = {
      sender_id: user.id,
      receiver_id: adminId,
      message: text,
      message_type: "text",
    };

    await API.post("/chat", msg);
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await API.post("/upload/file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const msg = {
      sender_id: user.id,
      receiver_id: adminId,
      file_url: `http://localhost:5000${res.data.fileUrl}`,
      message_type: "file",
    };

    await API.post("/chat", msg);
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chat with Admin</h2>

      <div className="h-[450px] overflow-y-auto bg-zinc-800 rounded-xl p-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.sender_id === user.id ? "text-right" : "text-left"}`}>
            {msg.message_type === "text" && (
              <p className="inline-block bg-white text-black px-4 py-2 rounded-xl">
                {msg.message}
              </p>
            )}

            {msg.message_type === "file" && (
              <a
                href={msg.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-blue-500 px-4 py-2 rounded-xl"
              >
                View File
              </a>
            )}

            {msg.message_type === "voice" && (
              <audio controls src={msg.voice_url} className="inline-block" />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-xl bg-zinc-800"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={sendText} className="bg-white text-black px-5 rounded-xl">
          Send
        </button>
        <input type="file" ref={fileRef} onChange={uploadFile} className="text-sm" />
      </div>
    </div>
  );
}

export default ChatBox;