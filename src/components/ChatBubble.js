import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋, I’m your AI Logistics Assistant powered by Mistral! How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 🔁 Auto-scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📤 Send message to backend
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        { message: input },
        { headers: { "Content-Type": "application/json" } }
      );

      const botReply = res.data.reply || "Sorry, I didn’t understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ AI server is unavailable right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* 💬 Chat Window */}
      {isOpen && (
        <div className="bg-gray-800 text-white w-80 h-96 p-4 rounded-2xl shadow-2xl flex flex-col border border-gray-700">
          <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
            <h3 className="text-lg font-bold">🤖 AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✖
            </button>
          </div>

          {/* 💭 Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] break-words ${
                  msg.sender === "bot"
                    ? "bg-gray-700 text-left"
                    : "bg-purple-600 text-right ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-700 text-gray-300 p-2 rounded-lg w-fit">
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 🧠 Input Field */}
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 p-2 rounded-l bg-gray-700 text-white outline-none"
              placeholder="Ask me anything..."
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 px-4 rounded-r hover:bg-purple-700 disabled:opacity-50"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* 🟣 Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
        >
          💬
        </button>
      )}
    </div>
  );
}
