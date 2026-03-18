import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function BlackboxChat() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", from: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, from: "user" }]);
    setInput("");

    // Mock bot reply after 1s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "This is a mock AI reply.", from: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-md bg-black text-white rounded-xl shadow-2xl flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 text-center font-bold text-lg">
          Blackbox AI Chat
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-[80%] ${
                msg.from === "bot" ? "bg-gray-800 self-start" : "bg-blue-600 self-end"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex border-t border-gray-700 p-4 gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-md bg-gray-700 text-white focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}
